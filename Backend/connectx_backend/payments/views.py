from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.conf import settings
from django.shortcuts import get_object_or_404
import requests
import json
import uuid
import datetime

from .models import OrderPayment, PaymentHistory
from .serializers import (
    OrderPaymentSerializer,
    ChapaRequestSerializer,
    ChapaResponseSerializer, 
    CashOnDeliverySerializer,
    PaymentHistorySerializer,
    PaymentInitiationSerializer,
    ChapaCallbackSerializer,
    CashOnDeliveryConfirmationSerializer
)
from orders.models import Order
from users.permissions import IsTenantOwner
from core.pagination import CustomPagination

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

# Chapa payment gateway constants
CHAPA_BASE_URL = "https://api.chapa.co"
CHAPA_INITIATE_URL = f"{CHAPA_BASE_URL}/v1/transaction/initialize"
CHAPA_VERIFY_URL = f"{CHAPA_BASE_URL}/v1/transaction/verify"


class OrderPaymentViewSet(viewsets.ModelViewSet):
    serializer_class = OrderPaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return OrderPayment.objects.none()
            
        user = self.request.user
        tenant = user.tenant
        
        tenant_owner_permission = IsTenantOwner()
        if tenant_owner_permission.has_permission(self.request, self):
            # Allow tenant owners to see all payments related to their tenant
            return OrderPayment.objects.filter(tenant=tenant)
            
        # Regular users can only see their own payments
        return OrderPayment.objects.filter(order__user=user)

    @swagger_auto_schema(
        operation_summary="List all payments",
        operation_description="Retrieves a list of payments based on the user's role. Tenant owners can see all payments for their tenant, while regular users can only see payments for their own orders.",
        responses={
            200: OrderPaymentSerializer(many=True),
            401: "Unauthorized - Authentication required"
        }
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Get payment details",
        operation_description="Retrieves the details of a specific payment, including payment history.",
        responses={
            200: OrderPaymentSerializer,
            401: "Unauthorized - Authentication required",
            404: "Not Found - Payment not found"
        }
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def perform_create(self, serializer):
        """Set tenant automatically when creating a payment."""
        serializer.save(tenant=self.request.user.tenant)

    @swagger_auto_schema(
        operation_summary="Get current user's payments",
        operation_description="Retrieves all payments for the current authenticated user's orders",
        responses={
            200: OrderPaymentSerializer(many=True),
            401: "Unauthorized - Authentication required"
        }
    )
    @action(detail=False, methods=['get'], url_path='user-payments')
    def my_payments(self, request):
        """Get all payments for the current authenticated user's orders."""
        queryset = OrderPayment.objects.filter(order__user=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_summary="Create Chapa payment",
        operation_description="Creates a new payment using Chapa payment gateway and returns a checkout URL to redirect the user to complete the payment",
        request_body=ChapaRequestSerializer,
        responses={
            200: ChapaResponseSerializer,
            400: "Bad request - Order already has payment or invalid input",
            403: "Forbidden - Not authorized to pay for this order",
            404: "Not found - Order not found",
            500: "Server error - Chapa API error"
        }
    )
    @action(detail=False, methods=['post'], url_path='chapa/create-payment')
    def chapa_initialize(self, request):
        """Initialize a Chapa payment for an order."""
        serializer = ChapaRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Get the order
        order_id = serializer.validated_data.get('order_id')
        order = get_object_or_404(Order, id=order_id)
        
        # Check if the user owns the order or is a tenant owner
        user = request.user
        if order.user != user and not IsTenantOwner().has_permission(request, self):
            return Response(
                {"error": "You don't have permission to process payment for this order"},
                status=status.HTTP_403_FORBIDDEN
            )
            
        # Check if the order already has a payment
        if hasattr(order, 'payment'):
            return Response(
                {"error": "This order already has a payment associated with it"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Generate a unique tx_ref
        tx_ref = f"tx-{order.order_number}-{uuid.uuid4().hex[:8]}"
        
        # Get callback and return URLs
        return_url = serializer.validated_data.get('return_url')
        callback_url = serializer.validated_data.get('callback_url')
        
        # Create the payment record
        payment = OrderPayment.objects.create(
            tenant=user.tenant,
            order=order,
            payment_method="chapa",
            amount=order.total_amount,
            currency="ETB",  # Ethiopian Birr
            status="pending",
            tx_ref=tx_ref,
            return_url=return_url,
            callback_url=callback_url,
            metadata=serializer.validated_data.get('metadata', {})
        )
        
        # Make the API call to Chapa
        CHAPA_API_KEY = settings.CHAPA_API_KEY
        CHAPA_API_URL = settings.CHAPA_API_URL
        
        payload = {
            "amount": str(order.total_amount),
            "currency": "ETB",
            "tx_ref": tx_ref,
            "callback_url": callback_url,
            "return_url": return_url,
            "email": serializer.validated_data.get('email', order.user.email),
            "first_name": serializer.validated_data.get('first_name', order.user.name.split(' ')[0] if ' ' in order.user.name else order.user.name),
            "last_name": serializer.validated_data.get('last_name', ' '.join(order.user.name.split(' ')[1:]) if ' ' in order.user.name else ''),
            "title": f"Payment for Order {order.order_number}",
            "description": f"Payment for Order {order.order_number}",
        }
        
        headers = {
            "Authorization": f"Bearer {CHAPA_API_KEY}",
            "Content-Type": "application/json",
        }
        
        try:
            response = requests.post(CHAPA_API_URL, json=payload, headers=headers)
            chapa_response = response.json()
            
            if response.status_code == 200 and chapa_response.get('status') == 'success':
                # Update payment with checkout URL
                payment.checkout_url = chapa_response.get('data', {}).get('checkout_url')
                payment.payment_id = chapa_response.get('data', {}).get('reference')
                payment.save()
                
                return Response({
                    "checkout_url": payment.checkout_url,
                    "tx_ref": tx_ref,
                    "status": "success",
                    "message": "Payment initialized successfully",
                    "payment_id": payment.id
                })
            else:
                payment.status = "rejected"
                payment.save()
                return Response(
                    {"error": f"Chapa API error: {chapa_response.get('message', 'Unknown error')}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        except Exception as e:
            payment.status = "rejected"
            payment.save()
            return Response(
                {"error": f"Error communicating with Chapa: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @swagger_auto_schema(
        operation_summary="Process Chapa callback",
        operation_description="Handles callbacks from Chapa payment gateway after a payment is completed",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'status': openapi.Schema(type=openapi.TYPE_STRING, description="Payment status from Chapa"),
                'tx_ref': openapi.Schema(type=openapi.TYPE_STRING, description="Transaction reference ID"),
                'reference': openapi.Schema(type=openapi.TYPE_STRING, description="Chapa payment reference"),
            },
            required=['status', 'tx_ref']
        ),
        responses={
            200: "Success - Callback processed",
            400: "Bad request - Missing required fields",
            404: "Not found - Payment not found"
        }
    )
    @action(detail=False, methods=['post'], url_path='chapa/webhook', permission_classes=[permissions.AllowAny])
    def chapa_callback(self, request):
        """Handle Chapa payment callback."""
        tx_ref = request.data.get('tx_ref')
        status_value = request.data.get('status')
        reference = request.data.get('reference')
        
        if not tx_ref or not status_value:
            return Response(
                {"error": "Missing required fields"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            payment = OrderPayment.objects.get(tx_ref=tx_ref)
        except OrderPayment.DoesNotExist:
            return Response(
                {"error": "Payment not found"},
                status=status.HTTP_404_NOT_FOUND
            )
            
        # Update payment status
        if status_value == 'success':
            payment.status = 'approved'
        elif status_value == 'failed':
            payment.status = 'rejected'
        else:
            payment.status = 'pending'
            
        payment.payment_id = reference
        payment.save()
        
        # Create payment history entry
        PaymentHistory.objects.create(
            payment=payment,
            status=payment.status,
            description=f"Payment callback received with status: {status_value}",
            metadata=request.data
        )
        
        return Response({"status": "success"})

    @swagger_auto_schema(
        operation_summary="Verify Chapa payment",
        operation_description="Verifies the status of a Chapa payment by checking with the Chapa API",
        manual_parameters=[
            openapi.Parameter(
                'tx_ref',
                openapi.IN_QUERY,
                description="Transaction reference ID",
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        responses={
            200: "Payment status information",
            400: "Bad request - Missing tx_ref",
            404: "Not found - Payment not found",
            500: "Server error - Chapa API error"
        }
    )
    @action(detail=False, methods=['get'], url_path='chapa/verify-payment')
    def verify_payment(self, request):
        """Verify a Chapa payment status."""
        tx_ref = request.query_params.get('tx_ref')
        
        if not tx_ref:
            return Response(
                {"error": "tx_ref is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            payment = OrderPayment.objects.get(tx_ref=tx_ref)
        except OrderPayment.DoesNotExist:
            return Response(
                {"error": "Payment not found"},
                status=status.HTTP_404_NOT_FOUND
            )
            
        # Verify payment with Chapa API
        CHAPA_API_KEY = settings.CHAPA_API_KEY
        CHAPA_VERIFY_URL = settings.CHAPA_VERIFY_URL
        
        headers = {
            "Authorization": f"Bearer {CHAPA_API_KEY}",
            "Content-Type": "application/json",
        }
        
        try:
            response = requests.get(f"{CHAPA_VERIFY_URL}{tx_ref}", headers=headers)
            chapa_response = response.json()
            
            if response.status_code == 200 and chapa_response.get('status') == 'success':
                data = chapa_response.get('data', {})
                status_value = data.get('status')
                
                # Update payment status
                if status_value == 'success':
                    payment.status = 'approved'
                elif status_value == 'failed':
                    payment.status = 'rejected'
                    
                payment.save()
                
                # Create payment history entry
                PaymentHistory.objects.create(
                    payment=payment,
                    status=payment.status,
                    description=f"Payment verification: {status_value}",
                    metadata=data
                )
                
                return Response({"status": payment.status, "data": data})
            else:
                return Response(
                    {"error": f"Chapa API error: {chapa_response.get('message', 'Unknown error')}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        except Exception as e:
            return Response(
                {"error": f"Error communicating with Chapa: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @swagger_auto_schema(
        operation_summary="Create Cash on Delivery payment",
        operation_description="Creates a new payment using Cash on Delivery method for an order",
        request_body=CashOnDeliverySerializer,
        responses={
            200: OrderPaymentSerializer,
            400: "Bad request - Order already has payment or invalid input",
            403: "Forbidden - Not authorized to pay for this order",
            404: "Not found - Order not found"
        }
    )
    @action(detail=False, methods=['post'], url_path='cod/create-payment')
    def cod_create(self, request):
        """Create a Cash on Delivery payment for an order."""
        serializer = CashOnDeliverySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Get the order
        order_id = serializer.validated_data.get('order_id')
        order = get_object_or_404(Order, id=order_id)
        
        # Check if the user owns the order or is a tenant owner
        user = request.user
        if order.user != user and not IsTenantOwner().has_permission(request, self):
            return Response(
                {"error": "You don't have permission to process payment for this order"},
                status=status.HTTP_403_FORBIDDEN
            )
            
        # Check if the order already has a payment
        if hasattr(order, 'payment'):
            return Response(
                {"error": "This order already has a payment associated with it"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Create the payment record
        payment = OrderPayment.objects.create(
            tenant=user.tenant,
            order=order,
            payment_method="cash_on_delivery",
            amount=order.total_amount,
            currency="ETB",  # Ethiopian Birr
            status="pending",
            cod_notes=serializer.validated_data.get('notes', ''),
            metadata={"created_by": str(user.id)}
        )
        
        # Update order status to processing
        order.status = "processing"
        order.save()
        
        # Create order history entry
        from orders.models import OrderHistory
        OrderHistory.objects.create(
            order=order,
            status=order.status,
            name="Order processing",
            description="Order set to processing with Cash on Delivery payment method",
            created_by=user
        )
        
        serializer = self.get_serializer(payment)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_summary="Update Cash on Delivery payment",
        operation_description="Updates the status of a Cash on Delivery payment (tenant owners only)",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'status': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    enum=['pending', 'approved', 'rejected'],
                    description="Payment status to update to"
                ),
                'collector': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Name of the person who collected the payment"
                ),
                'notes': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Additional notes about the collection"
                ),
            },
            required=['status']
        ),
        responses={
            200: OrderPaymentSerializer,
            400: "Bad request - Not a COD payment or invalid status",
            403: "Forbidden - Only tenant owners can update COD payments",
            404: "Not found - Payment not found"
        }
    )
    @action(detail=True, methods=['post'], url_path='cod/update-payment')
    def cod_update(self, request, pk=None):
        """Update a Cash on Delivery payment (for tenant owners only)."""
        # Only tenant owners can update COD payments
        if not IsTenantOwner().has_permission(request, self):
            return Response(
                {"error": "Only tenant owners can update COD payments"},
                status=status.HTTP_403_FORBIDDEN
            )
            
        payment = self.get_object()
        
        # Check if this is a COD payment
        if payment.payment_method != "cash_on_delivery":
            return Response(
                {"error": "This is not a Cash on Delivery payment"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Update payment status
        status_value = request.data.get('status')
        if status_value:
            if status_value not in ['pending', 'approved', 'rejected']:
                return Response(
                    {"error": "Invalid status. Must be one of: pending, approved, rejected"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            payment.status = status_value
            
        # Update collector info
        collector = request.data.get('collector')
        if collector:
            payment.cod_collector = collector
            payment.cod_collection_date = datetime.datetime.now()
            
        # Update notes
        notes = request.data.get('notes')
        if notes:
            payment.cod_notes = notes
            
        payment.save()
        
        # Create payment history entry
        PaymentHistory.objects.create(
            payment=payment,
            status=payment.status,
            description=f"Cash on Delivery payment updated to {payment.status}",
            metadata={"updated_by": str(request.user.id)}
        )
        
        serializer = self.get_serializer(payment)
        return Response(serializer.data)

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = OrderPayment.objects.all()
    serializer_class = OrderPaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = CustomPagination
    
    def get_queryset(self):
        """Filter payments based on user role."""
        user = self.request.user
        
        # Tenant owners can see all payments for their tenant
        if IsTenantOwner().has_permission(self.request, self):
            return OrderPayment.objects.filter(order__tenant=user.tenant)
        
        # Regular users can only see their own payments
        return OrderPayment.objects.filter(order__user=user)
    
    @action(detail=False, methods=['post'], url_path='initiate')
    def initiate_payment(self, request):
        """Initialize a payment for an order."""
        serializer = PaymentInitiationSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        order_id = serializer.validated_data['order_id']
        payment_method = serializer.validated_data['payment_method']
        return_url = serializer.validated_data.get('return_url')
        notes = serializer.validated_data.get('notes', '')
        
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if the user is authorized to pay for this order
        if order.user != request.user and not IsTenantOwner().has_permission(request, self):
            return Response(
                {"error": "You are not authorized to pay for this order"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check if order already has a pending payment
        existing_payment = OrderPayment.objects.filter(
            order=order, 
            status__in=['pending', 'processing']
        ).first()
        
        if existing_payment:
            payment_serializer = OrderPaymentSerializer(existing_payment)
            return Response(
                {"message": "A payment for this order is already in progress", "payment": payment_serializer.data},
                status=status.HTTP_200_OK
            )
        
        # Create a new payment
        payment = OrderPayment.objects.create(
            order=order,
            amount=order.total_amount,
            payment_method=payment_method,
            status="pending",
            notes=notes
        )
        
        # Create payment history entry
        PaymentHistory.objects.create(
            payment=payment,
            status="pending",
            description="Payment initiated",
            created_by=request.user
        )
        
        # Process payment based on the selected method
        if payment_method == 'chapa':
            # Initialize Chapa payment
            return self._initialize_chapa_payment(payment, order, return_url, request.user)
        elif payment_method == 'cod':
            # Initialize Cash on Delivery payment
            payment.status = 'processing'
            payment.save()
            
            # Update payment history
            PaymentHistory.objects.create(
                payment=payment,
                status="processing",
                description="Cash on Delivery payment initiated",
                created_by=request.user
            )
            
            # Update order status
            order.status = 'processing'
            order.save()
            
            payment_serializer = OrderPaymentSerializer(payment)
            return Response(payment_serializer.data, status=status.HTTP_201_CREATED)
    
    def _initialize_chapa_payment(self, payment, order, return_url, user):
        """Initialize payment with Chapa payment gateway."""
        api_key = settings.CHAPA_SECRET_KEY
        tx_ref = f"tx-{payment.id}"
        
        # Prepare headers
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        # Prepare callback URL
        callback_url = f"{settings.BASE_URL}/api/payments/chapa-callback"
        
        # Prepare Chapa payload
        payload = {
            "amount": str(payment.amount),
            "currency": "ETB",
            "tx_ref": tx_ref,
            "callback_url": callback_url,
            "return_url": return_url or f"{settings.FRONTEND_URL}/orders/{order.id}/payment",
            "customer": {
                "name": user.name or "Customer",
                "email": user.email,
                "phone_number": order.phone or "0000000000"
            },
            "customization": {
                "title": f"Order #{order.order_number}",
                "description": f"Payment for order #{order.order_number}",
                "logo": order.tenant.logo or ""
            }
        }
        
        try:
            # Make API request to Chapa
            response = requests.post(CHAPA_INITIATE_URL, headers=headers, json=payload)
            response_data = response.json()
            
            if response.status_code == 200 and response_data.get('status') == 'success':
                # Update payment with Chapa data
                payment.transaction_reference = tx_ref
                payment.checkout_url = response_data.get('data', {}).get('checkout_url')
                payment.save()
                
                payment_serializer = OrderPaymentSerializer(payment)
                return Response(payment_serializer.data, status=status.HTTP_201_CREATED)
            else:
                # Payment initialization failed
                payment.status = 'failed'
                payment.notes = f"Chapa initialization failed: {response_data.get('message')}"
                payment.save()
                
                # Create payment history entry
                PaymentHistory.objects.create(
                    payment=payment,
                    status="failed",
                    description=f"Chapa initialization failed: {response_data.get('message')}",
                    created_by=user
                )
                
                return Response(
                    {"error": "Payment initialization failed", "details": response_data},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            # Handle exceptions
            payment.status = 'failed'
            payment.notes = f"Payment initialization error: {str(e)}"
            payment.save()
            
            # Create payment history entry
            PaymentHistory.objects.create(
                payment=payment,
                status="failed",
                description=f"Payment initialization error: {str(e)}",
                created_by=user
            )
            
            return Response(
                {"error": "Payment initialization error", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'], url_path='chapa-callback')
    def chapa_callback(self, request):
        """Handle Chapa payment callback."""
        serializer = ChapaCallbackSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        tx_ref = serializer.validated_data['tx_ref']
        transaction_id = serializer.validated_data['transaction_id']
        payment_status = serializer.validated_data['status']
        
        try:
            payment = OrderPayment.objects.get(transaction_reference=tx_ref)
        except OrderPayment.DoesNotExist:
            return Response(
                {"error": "Payment not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Verify payment with Chapa API
        api_key = settings.CHAPA_SECRET_KEY
        headers = {"Authorization": f"Bearer {api_key}"}
        
        try:
            verification_url = f"{CHAPA_VERIFY_URL}/{transaction_id}"
            response = requests.get(verification_url, headers=headers)
            verification_data = response.json()
            
            if response.status_code == 200 and verification_data.get('status') == 'success':
                # Update payment status
                payment.status = 'completed' if payment_status == 'success' else 'failed'
                payment.save()
                
                # Update order status
                order = payment.order
                order.status = 'processing' if payment_status == 'success' else 'pending'
                order.save()
                
                # Create payment history entry
                description = "Payment completed successfully" if payment_status == 'success' else f"Payment failed: {verification_data.get('message')}"
                PaymentHistory.objects.create(
                    payment=payment,
                    status=payment.status,
                    description=description,
                    created_by=order.user
                )
                
                return Response({"status": "success"}, status=status.HTTP_200_OK)
            else:
                # Payment verification failed
                payment.status = 'failed'
                payment.save()
                
                PaymentHistory.objects.create(
                    payment=payment,
                    status="failed",
                    description=f"Payment verification failed: {verification_data.get('message')}",
                    created_by=payment.order.user
                )
                
                return Response(
                    {"error": "Payment verification failed", "details": verification_data},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            # Handle exceptions
            payment.status = 'failed'
            payment.save()
            
            PaymentHistory.objects.create(
                payment=payment,
                status="failed",
                description=f"Payment callback error: {str(e)}",
                created_by=payment.order.user
            )
            
            return Response(
                {"error": "Payment callback error", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'], url_path='confirm-cod')
    def confirm_cod_payment(self, request, pk=None):
        """Confirm a Cash on Delivery payment."""
        payment = self.get_object()
        serializer = CashOnDeliveryConfirmationSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        collected_by = serializer.validated_data['collected_by']
        notes = serializer.validated_data.get('notes', '')
        
        # Check if this is a COD payment
        if payment.payment_method != 'cod':
            return Response(
                {"error": "This is not a Cash on Delivery payment"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if payment can be confirmed (not already completed or failed)
        if payment.status not in ['pending', 'processing']:
            return Response(
                {"error": f"Cannot confirm payment in '{payment.status}' status"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check authorization (only tenant owners can confirm COD payments)
        if not IsTenantOwner().has_permission(request, self):
            return Response(
                {"error": "Only tenant owners can confirm Cash on Delivery payments"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Update payment status
        payment.status = 'completed'
        payment.notes = f"Collected by: {collected_by}. {notes}"
        payment.save()
        
        # Create payment history entry
        PaymentHistory.objects.create(
            payment=payment,
            status="completed",
            description=f"Cash on Delivery payment confirmed. Collected by: {collected_by}. {notes}",
            created_by=request.user
        )
        
        # Update order status
        order = payment.order
        order.status = 'delivered'
        order.save()
        
        payment_serializer = OrderPaymentSerializer(payment)
        return Response(payment_serializer.data, status=status.HTTP_200_OK)
