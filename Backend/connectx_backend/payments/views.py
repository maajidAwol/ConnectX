from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.conf import settings
from django.shortcuts import get_object_or_404
import requests
import json
import uuid
import datetime
from django.urls import reverse

from .models import Payment, PaymentHistory
from .serializers import (
    PaymentSerializer,
    PaymentHistorySerializer,
    PaymentInitiationSerializer,
    ChapaCallbackSerializer,
    CashOnDeliveryConfirmationSerializer
)
from orders.models import Order
from users.permissions import IsTenantOwner,IsTenantMember
from core.pagination import CustomPagination

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .chapa import ChapaPayment, ChapaError

# Chapa payment gateway constants
CHAPA_BASE_URL = "https://api.chapa.co"
CHAPA_INITIATE_URL = f"{CHAPA_BASE_URL}/v1/transaction/initialize"
CHAPA_VERIFY_URL = f"{CHAPA_BASE_URL}/v1/transaction/verify"


class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = CustomPagination

    def get_queryset(self):
        """Filter payments based on user role."""
        # Handle swagger schema generation
        if getattr(self, 'swagger_fake_view', False):
            return Payment.objects.none()

        user = self.request.user
        
        # Tenant owners can see all payments for their tenant
        if IsTenantMember().has_permission(self.request, self):
            return Payment.objects.filter(order__tenant=user.tenant)
        
        # Regular users can only see their own payments
        return Payment.objects.filter(order__user=user)
    
    @swagger_auto_schema(
        operation_summary="List payments",
        operation_description="Get a list of payments. Tenant owners see all payments for their tenant, while regular users only see their own payments.",
        responses={
            200: openapi.Response(
                description="List of payments",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'count': openapi.Schema(type=openapi.TYPE_INTEGER),
                        'next': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_URI, nullable=True),
                        'previous': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_URI, nullable=True),
                        'results': openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            items=openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                properties={
                                    'id': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_UUID),
                                    'order': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_UUID),
                                    'order_number': openapi.Schema(type=openapi.TYPE_STRING),
                                    'amount': openapi.Schema(type=openapi.TYPE_STRING, format='decimal'),
                                    'payment_method': openapi.Schema(type=openapi.TYPE_STRING, enum=['chapa', 'cod']),
                                    'status': openapi.Schema(type=openapi.TYPE_STRING, enum=['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled']),
                                    'transaction_id': openapi.Schema(type=openapi.TYPE_STRING),
                                    'created_at': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                                    'updated_at': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                                }
                            )
                        )
                    }
                )
            ),
            401: "Unauthorized - Authentication required"
        }
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Get payment details",
        operation_description="Get detailed information about a specific payment.",
        responses={
            200: openapi.Response(
                description="Payment details",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'id': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_UUID),
                        'order': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_UUID),
                        'order_number': openapi.Schema(type=openapi.TYPE_STRING),
                        'amount': openapi.Schema(type=openapi.TYPE_STRING, format='decimal'),
                        'payment_method': openapi.Schema(type=openapi.TYPE_STRING, enum=['chapa', 'cod']),
                        'status': openapi.Schema(type=openapi.TYPE_STRING, enum=['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled']),
                        'transaction_id': openapi.Schema(type=openapi.TYPE_STRING),
                        'verification_data': openapi.Schema(type=openapi.TYPE_OBJECT, nullable=True),
                        'webhook_data': openapi.Schema(type=openapi.TYPE_OBJECT, nullable=True),
                        'created_at': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                        'updated_at': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                        'history': openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            items=openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                properties={
                                    'status': openapi.Schema(type=openapi.TYPE_STRING),
                                    'description': openapi.Schema(type=openapi.TYPE_STRING),
                                    'created_by_name': openapi.Schema(type=openapi.TYPE_STRING),
                                    'created_at': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                                }
                            )
                        )
                    }
                )
            ),
            401: "Unauthorized - Authentication required",
            404: "Not Found - Payment not found"
        }
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
    
    @swagger_auto_schema(
        operation_summary="Initialize Chapa payment",
        operation_description="Initialize a new payment transaction with Chapa payment gateway.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['order_id'],
            properties={
                'order_id': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_UUID,
                    description="UUID of the order to pay for"
                ),
                'phone_number': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Customer's phone number (optional)"
                ),
                'return_url': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="URL to return to after payment (optional)"
                )
            }
        ),
        responses={
            200: openapi.Response(
                description="Payment initialized successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'status': openapi.Schema(type=openapi.TYPE_STRING),
                        'message': openapi.Schema(type=openapi.TYPE_STRING),
                        'data': openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'payment_id': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_UUID),
                                'checkout_url': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_URI),
                                'tx_ref': openapi.Schema(type=openapi.TYPE_STRING)
                            }
                        )
                    }
                )
            ),
            400: "Bad Request - Invalid input or missing order_id",
            401: "Unauthorized - Authentication required",
            404: "Not Found - Order not found",
            500: "Internal Server Error - Payment initialization failed"
        }
    )
    @action(detail=False, methods=['post'])
    def initialize_chapa_payment(self, request):
        """Initialize a Chapa payment for an order."""
        order_id = request.data.get('order_id')
        if not order_id:
            return Response(
                {"error": "order_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            # Get the order
            order = get_object_or_404(Order, id=order_id, user=request.user)
            
            # Validate email
            email = order.email or request.user.email
            if not email:
                return Response(
                    {"error": "Valid email address is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Generate unique transaction reference
            tx_ref = f"TX-{uuid.uuid4().hex[:16].upper()}"
            
            # Get the base URL for callbacks
            base_url = request.build_absolute_uri('/').rstrip('/')
            
            # Get customer name
            customer_name = request.user.name or 'Customer'
            name_parts = customer_name.split()
            first_name = name_parts[0][:35]  # Limit to 35 chars
            # For last name, use first character of remaining parts or user ID
            last_name = (
                ''.join(part[0] for part in name_parts[1:])[:35]  # Take initials of remaining parts
                if len(name_parts) > 1 
                else str(request.user.id)[:35]  # Limit user ID to 35 chars
            )
            
            # Get phone number from request or order
            phone_number = request.data.get('phone_number') or order.phone
            
            # Get return URL
            return_url = (
                request.data.get('return_url') or 
                f"{base_url}/payment-complete/"  # Default return URL
            )

            # Print debug information
            print(f"Debug - Payment Initialization Data:")
            print(f"Amount: {float(order.total_amount)}")
            print(f"Email: {email}")
            print(f"First Name: {first_name}")
            print(f"Last Name: {last_name}")
            print(f"Phone: {phone_number}")
            print(f"TX Ref: {tx_ref}")
            print(f"Callback URL: {base_url}/api/payments/chapa-webhook/")
            print(f"Return URL: {return_url}")
            
            # Initialize payment with Chapa
            payment_data = ChapaPayment.initialize_payment(
                amount=float(order.total_amount),
                currency='ETB',  # Ethiopian Birr
                email=email,
                first_name=first_name,
                last_name=last_name,
                tx_ref=tx_ref,
                callback_url=f"{base_url}/api/payments/chapa-webhook/",
                return_url=return_url,
                customization={
                    "title": f"Order {order.order_number[-6:]}",  # Use last 6 chars to ensure under 16 chars
                    "description": f"Payment for order {order.order_number}",
                    "phone_number": phone_number
                } if phone_number else None
            )
            
            if payment_data["status"] == "success":
                # Create payment record only after successful Chapa initialization
                payment = Payment.objects.create(
                    order=order,
                    amount=order.total_amount,
                    payment_method='chapa',
                    transaction_id=tx_ref,
                    status='pending'
                )
                
                return Response({
                    'status': 'success',
                    'message': payment_data["message"],
                    'data': {
                        'payment_id': payment.id,
                        'checkout_url': payment_data["data"]["checkout_url"],
                        'tx_ref': tx_ref
                    }
                })
            else:
                return Response(
                    {"error": payment_data.get("message", "Payment initialization failed")},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except ChapaError as e:
            print(f"Chapa Error: {str(e)}")  # Debug log
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            import traceback
            print(f"Unexpected Error: {str(e)}")
            print(f"Traceback: {traceback.format_exc()}")  # Print full traceback
            return Response(
                {"error": "An unexpected error occurred. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @swagger_auto_schema(
        operation_summary="Verify Chapa payment",
        operation_description="Verify the status of a Chapa payment transaction.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['tx_ref'],
            properties={
                'tx_ref': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Transaction reference to verify"
                )
            }
        ),
        responses={
            200: openapi.Response(
                description="Payment verification response",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'status': openapi.Schema(type=openapi.TYPE_STRING, enum=['success', 'failed']),
                        'message': openapi.Schema(type=openapi.TYPE_STRING),
                        'payment': openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'id': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_UUID),
                                'order': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_UUID),
                                'order_number': openapi.Schema(type=openapi.TYPE_STRING),
                                'amount': openapi.Schema(type=openapi.TYPE_STRING, format='decimal'),
                                'payment_method': openapi.Schema(type=openapi.TYPE_STRING, enum=['chapa', 'cod']),
                                'status': openapi.Schema(type=openapi.TYPE_STRING, enum=['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled']),
                                'transaction_id': openapi.Schema(type=openapi.TYPE_STRING),
                                'verification_data': openapi.Schema(type=openapi.TYPE_OBJECT, nullable=True),
                                'webhook_data': openapi.Schema(type=openapi.TYPE_OBJECT, nullable=True),
                                'created_at': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                                'updated_at': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME)
                            }
                        )
                    }
                )
            ),
            400: "Bad Request - Missing tx_ref",
            401: "Unauthorized - Authentication required",
            404: "Not Found - Payment not found",
            500: "Internal Server Error - Verification failed"
        }
    )
    @action(detail=False, methods=['post'])
    def verify_chapa_payment(self, request):
        """Verify a Chapa payment transaction."""
        tx_ref = request.data.get('tx_ref')
        if not tx_ref:
            return Response(
                {"error": "tx_ref is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            # Get the payment
            payment = get_object_or_404(Payment, transaction_id=tx_ref)
            
            # Verify with Chapa
            verification = ChapaPayment.verify_payment(tx_ref)
            
            # Update payment status based on verification
            if verification['status'] == 'success':
                payment.status = 'completed'
                payment.verification_data = verification
                payment.save()
                
                # Update order status
                order = payment.order
                order.status = 'processing'
                order.save()
                
                return Response({
                    'status': 'success',
                    'message': 'Payment verified successfully',
                    'payment': PaymentSerializer(payment).data
                })
            else:
                payment.status = 'failed'
                payment.verification_data = verification
                payment.save()
                
                return Response({
                    'status': 'failed',
                    'message': 'Payment verification failed',
                    'payment': PaymentSerializer(payment).data
                })
                
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @swagger_auto_schema(
        operation_summary="Handle Chapa webhook",
        operation_description="Handle payment status updates from Chapa payment gateway.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['tx_ref', 'status'],
            properties={
                'tx_ref': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Transaction reference"
                ),
                'status': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Payment status",
                    enum=['success', 'failed']
                ),
                'transaction_id': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Chapa transaction ID"
                )
            }
        ),
        responses={
            200: openapi.Response(
                description="Webhook processed successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'status': openapi.Schema(type=openapi.TYPE_STRING, enum=['success'])
                    }
                )
            ),
            400: "Bad Request - Invalid webhook data",
            404: "Not Found - Payment not found",
            500: "Internal Server Error - Webhook processing failed"
        }
    )
    @action(detail=False, methods=['post'])
    def chapa_webhook(self, request):
        """Handle Chapa payment webhooks."""
        try:
            # Get the transaction reference from the webhook data
            tx_ref = request.data.get('tx_ref')
            if not tx_ref:
                return Response(
                    {"error": "tx_ref not found in webhook data"},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            # Get the payment
            payment = get_object_or_404(Payment, transaction_id=tx_ref)
            
            # Update payment status based on webhook data
            webhook_status = request.data.get('status', '').lower()
            
            if webhook_status == 'success':
                payment.status = 'completed'
                payment.webhook_data = request.data
                payment.save()
                
                # Update order status
                order = payment.order
                order.status = 'processing'
                order.save()
                
            elif webhook_status == 'failed':
                payment.status = 'failed'
                payment.webhook_data = request.data
                payment.save()
                
            return Response({'status': 'success'})
            
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    @swagger_auto_schema(
        operation_summary="Confirm Cash on Delivery payment",
        operation_description="Confirm receipt of payment for Cash on Delivery orders. Only accessible by tenant owners.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['confirmation_note'],
            properties={
                'confirmation_note': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Note about the payment confirmation"
                )
            }
        ),
        responses={
            200: openapi.Response(
                description="Payment confirmed successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'id': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_UUID),
                        'order': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_UUID),
                        'order_number': openapi.Schema(type=openapi.TYPE_STRING),
                        'amount': openapi.Schema(type=openapi.TYPE_STRING, format='decimal'),
                        'payment_method': openapi.Schema(type=openapi.TYPE_STRING, enum=['chapa', 'cod']),
                        'status': openapi.Schema(type=openapi.TYPE_STRING, enum=['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled']),
                        'transaction_id': openapi.Schema(type=openapi.TYPE_STRING),
                        'created_at': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                        'updated_at': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME)
                    }
                )
            ),
            400: "Bad Request - Invalid input or payment not in correct state",
            401: "Unauthorized - Authentication required",
            403: "Forbidden - Only tenant owners can confirm COD payments",
            404: "Not Found - Payment not found"
        }
    )
    @action(detail=True, methods=['post'])
    def confirm_cod_payment(self, request, pk=None):
        """Confirm a Cash on Delivery payment."""
        payment = self.get_object()
        serializer = CashOnDeliveryConfirmationSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if this is a COD payment
        if payment.payment_method != 'cod':
            return Response(
                {"error": "This is not a Cash on Delivery payment"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if payment can be confirmed
        if payment.status not in ['pending', 'processing']:
            return Response(
                {"error": f"Cannot confirm payment in '{payment.status}' status"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check authorization
        if not IsTenantMember().has_permission(request, self):
            return Response(
                {"error": "Only tenant owners can confirm Cash on Delivery payments"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Update payment status
        payment.status = 'completed'
        payment.save()
        
        # Update order status
        order = payment.order
        order.status = 'processing'
        order.save()
        
        return Response(PaymentSerializer(payment).data)
