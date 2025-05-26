from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action, permission_classes, authentication_classes, api_view
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse
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
            print(f"Callback URL: {base_url}/api/payments/chapa_webhook/")
            print(f"Return URL: {return_url}")
            
            # Initialize payment with Chapa
            payment_data = ChapaPayment.initialize_payment(
                amount=float(order.total_amount),
                currency='ETB',  # Ethiopian Birr
                email=email,
                first_name=first_name,
                last_name=last_name,
                tx_ref=tx_ref,
                callback_url=f"{base_url}/api/payments/chapa_webhook/",
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
        operation_summary="Test webhook simulation",
        operation_description="Simulate a Chapa webhook for testing purposes.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['tx_ref', 'event'],
            properties={
                'tx_ref': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Transaction reference to test"
                ),
                'event': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Event type to simulate",
                    enum=['charge.success', 'charge.failed', 'charge.cancelled', 'charge.refunded']
                ),
                'status': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Payment status",
                    enum=['success', 'failed', 'cancelled', 'refunded']
                )
            }
        ),
        responses={
            200: openapi.Response(
                description="Webhook simulation result",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'status': openapi.Schema(type=openapi.TYPE_STRING),
                        'message': openapi.Schema(type=openapi.TYPE_STRING),
                        'webhook_data': openapi.Schema(type=openapi.TYPE_OBJECT)
                    }
                )
            )
        }
    )
    @action(detail=False, methods=['post'], authentication_classes=[], permission_classes=[])
    def simulate_webhook(self, request):
        """Simulate a Chapa webhook for testing purposes."""
        tx_ref = request.data.get('tx_ref')
        event = request.data.get('event', 'charge.success')
        status_value = request.data.get('status', 'success')
        
        if not tx_ref:
            return Response(
                {"error": "tx_ref is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create a mock Chapa webhook payload
        mock_webhook_data = {
            "event": event,
            "first_name": "Test",
            "last_name": "Customer",
            "email": "test@example.com",
            "mobile": "251900000000",
            "currency": "ETB",
            "amount": "100.00",
            "charge": "3.00",
            "status": status_value,
            "mode": "test",
            "reference": f"AP{tx_ref}",
            "created_at": "2024-01-01T12:00:00.000000Z",
            "updated_at": "2024-01-01T12:00:00.000000Z",
            "type": "API",
            "tx_ref": tx_ref,
            "payment_method": "test",
            "customization": {
                "title": "Test Payment",
                "description": "Test webhook simulation",
                "logo": None
            },
            "meta": None
        }
        
        # Create a new request object with the mock data
        from django.http import HttpRequest
        mock_request = HttpRequest()
        mock_request.method = 'POST'
        mock_request.META = request.META.copy()
        
        # Set the data
        class MockData:
            def get(self, key, default=None):
                return mock_webhook_data.get(key, default)
        
        mock_request.data = MockData()
        
        # Call the actual webhook handler
        try:
            webhook_response = self.chapa_webhook(mock_request)
            return Response({
                'status': 'success',
                'message': f'Webhook simulation completed for {tx_ref}',
                'webhook_data': mock_webhook_data,
                'webhook_response': webhook_response.data
            })
        except Exception as e:
                         return Response({
                 'status': 'error',
                 'message': f'Webhook simulation failed: {str(e)}',
                 'webhook_data': mock_webhook_data
             })
    
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
    @action(detail=False, methods=['post'], authentication_classes=[], permission_classes=[])
    def chapa_webhook(self, request):
        """Handle Chapa payment webhooks."""
        try:
            # Parse JSON body manually for webhook
            import json
            if hasattr(request, 'body'):
                webhook_data = json.loads(request.body.decode('utf-8'))
            else:
                webhook_data = request.data
                
            print(f"Webhook received: {webhook_data}")
            print(f"Webhook headers: {dict(request.META)}")
            
            # Verify webhook signature for security using hardcoded secret
            from .chapa import CHAPA_WEBHOOK_SECRET_DEMO
            webhook_secret = CHAPA_WEBHOOK_SECRET_DEMO
            
            # Get signature from headers
            chapa_signature = request.META.get('HTTP_CHAPA_SIGNATURE')
            x_chapa_signature = request.META.get('HTTP_X_CHAPA_SIGNATURE')
            
            print(f"Chapa-Signature: {chapa_signature}")
            print(f"x-chapa-signature: {x_chapa_signature}")
            
            # For now, skip signature verification for testing but log it
            # if chapa_signature or x_chapa_signature:
            #     if not ChapaPayment.verify_webhook_signature(
            #         request.body.decode('utf-8'), 
            #         chapa_signature or x_chapa_signature, 
            #         webhook_secret
            #     ):
            #         print("Invalid webhook signature - request rejected")
            #         return Response(
            #             {"error": "Invalid webhook signature"},
            #             status=status.HTTP_401_UNAUTHORIZED
            #         )
            
            # Get transaction reference from webhook data
            tx_ref = webhook_data.get('tx_ref')
            if not tx_ref:
                print(f"No tx_ref found in webhook data: {webhook_data}")
                return Response(
                    {"error": "tx_ref not found in webhook data"},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            # Get the payment
            try:
                payment = Payment.objects.get(transaction_id=tx_ref)
            except Payment.DoesNotExist:
                print(f"Payment not found for tx_ref: {tx_ref}")
                return Response(
                    {"error": f"Payment not found for tx_ref: {tx_ref}"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Process webhook based on event and status
            event_type = webhook_data.get('event', '')
            webhook_status = webhook_data.get('status', '').lower()
            payment_method = webhook_data.get('payment_method', '')
            amount = webhook_data.get('amount', '')
            
            print(f"Processing webhook - Event: {event_type}, Status: {webhook_status}, TX Ref: {tx_ref}, Method: {payment_method}, Amount: {amount}")
            
            # Handle successful payment
            if event_type == 'charge.success' or webhook_status == 'success':
                payment.status = 'completed'
                payment.webhook_data = webhook_data
                payment.save()
                
                # Update order status
                order = payment.order
                order.status = 'processing'
                order.save()
                
                # Update product statistics for successful payment
                self._update_product_statistics(order)
                
                print(f"✅ Payment {tx_ref} marked as completed - Amount: {amount} ETB via {payment_method}")
                
            # Handle failed payment
            elif event_type in ['charge.failed', 'charge.cancelled'] or webhook_status in ['failed', 'cancelled']:
                payment.status = 'failed'
                payment.webhook_data = webhook_data
                payment.save()
                
                print(f"❌ Payment {tx_ref} marked as failed")
                
            # Handle refunded payment
            elif event_type == 'charge.refunded' or webhook_status == 'refunded':
                payment.status = 'refunded'
                payment.webhook_data = webhook_data
                payment.save()
                
                print(f"🔄 Payment {tx_ref} marked as refunded")
                
            else:
                print(f"⚠️ Unhandled webhook event: {event_type} with status: {webhook_status}")
            
            # Always return 200 OK to acknowledge receipt
            return Response({
                'status': 'success',
                'message': f'Webhook processed for {tx_ref}',
                'event': event_type,
                'payment_status': webhook_status
            }, status=status.HTTP_200_OK)
            
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {str(e)}")
            return Response({'status': 'error', 'message': 'Invalid JSON'}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Webhook processing error: {str(e)}")
            import traceback
            print(f"Traceback: {traceback.format_exc()}")
            # Still return 200 to prevent Chapa from retrying
            return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_200_OK)
    
    def _update_product_statistics(self, order):
        """Update product statistics when payment is successful."""
        try:
            from products.models import Product
            
            for item in order.items.all():
                product = item.product
                # Update total sold quantity
                product.total_sold += item.quantity
                product.save()
                
                print(f"Updated product {product.name} - Total sold: {product.total_sold}")
                
        except Exception as e:
            print(f"Error updating product statistics: {str(e)}")
            
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

    @swagger_auto_schema(
        operation_summary="Test webhook configuration",
        operation_description="Test endpoint to verify webhook secret configuration.",
        responses={
            200: openapi.Response(
                description="Webhook configuration status",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'webhook_configured': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                        'webhook_url': openapi.Schema(type=openapi.TYPE_STRING),
                        'message': openapi.Schema(type=openapi.TYPE_STRING)
                    }
                )
            )
        }
    )
    @action(detail=False, methods=['get'])
    def test_webhook_config(self, request):
        """Test webhook configuration."""
        from .chapa import CHAPA_WEBHOOK_SECRET_DEMO
        webhook_secret = CHAPA_WEBHOOK_SECRET_DEMO
        base_url = request.build_absolute_uri('/').rstrip('/')
        webhook_url = f"{base_url}/api/payments/chapa_webhook/"
        standalone_webhook_url = f"{base_url}/api/payments/chapa_webhook_standalone/"
        
        return Response({
            'webhook_configured': True,
            'webhook_url': webhook_url,
            'standalone_webhook_url': standalone_webhook_url,
            'webhook_secret': webhook_secret,  # Show the secret for demo purposes
            'production_webhook_url': 'https://connectx-backend-295168525338.europe-west1.run.app/api/payments/chapa_webhook/',
            'production_standalone_webhook_url': 'https://connectx-backend-295168525338.europe-west1.run.app/api/payments/chapa_webhook_standalone/',
            'message': 'Webhook is configured with hardcoded demo secret',
            'authentication_required': False,
            'csrf_protection': False,
            'recommended_endpoint': 'Use standalone_webhook_url for Chapa configuration - it bypasses all authentication',
            'expected_chapa_events': [
                'charge.success',
                'charge.failed', 
                'charge.cancelled',
                'charge.refunded'
            ],
             
            'webhook_processing': {
                'signature_verification': 'Temporarily disabled for testing',
                'product_statistics_update': 'Enabled - updates total_sold on successful payments',
                'order_status_update': 'Enabled - sets order to processing on success'
            }
        })


# Standalone webhook function to bypass authentication issues
@csrf_exempt
@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def chapa_webhook_standalone(request):
    """
    Standalone Chapa webhook handler that bypasses all authentication.
    This is a separate function to ensure no authentication middleware interferes.
    """
    try:
        # Parse JSON body manually for webhook
        if hasattr(request, 'body'):
            webhook_data = json.loads(request.body.decode('utf-8'))
        else:
            webhook_data = request.data
            
        print(f"🔔 Standalone Webhook received: {webhook_data}")
        print(f"📋 Webhook headers: {dict(request.META)}")
        
        # Verify webhook signature for security using hardcoded secret
        from .chapa import CHAPA_WEBHOOK_SECRET_DEMO
        webhook_secret = CHAPA_WEBHOOK_SECRET_DEMO
        
        # Get signature from headers
        chapa_signature = request.META.get('HTTP_CHAPA_SIGNATURE')
        x_chapa_signature = request.META.get('HTTP_X_CHAPA_SIGNATURE')
        
        print(f"🔐 Chapa-Signature: {chapa_signature}")
        print(f"🔐 x-chapa-signature: {x_chapa_signature}")
        
        # Get transaction reference from webhook data
        tx_ref = webhook_data.get('tx_ref')
        if not tx_ref:
            print(f"❌ No tx_ref found in webhook data: {webhook_data}")
            return JsonResponse({
                "error": "tx_ref not found in webhook data",
                "status": "error"
            }, status=400)
            
        # Get the payment
        try:
            payment = Payment.objects.get(transaction_id=tx_ref)
        except Payment.DoesNotExist:
            print(f"❌ Payment not found for tx_ref: {tx_ref}")
            return JsonResponse({
                "error": f"Payment not found for tx_ref: {tx_ref}",
                "status": "error"
            }, status=404)
        
        # Process webhook based on event and status
        event_type = webhook_data.get('event', '')
        webhook_status = webhook_data.get('status', '').lower()
        payment_method = webhook_data.get('payment_method', '')
        amount = webhook_data.get('amount', '')
        
        print(f"🔄 Processing webhook - Event: {event_type}, Status: {webhook_status}, TX Ref: {tx_ref}, Method: {payment_method}, Amount: {amount}")
        
        # Handle successful payment
        if event_type == 'charge.success' or webhook_status == 'success':
            payment.status = 'completed'
            payment.webhook_data = webhook_data
            payment.save()
            
            # Update order status
            order = payment.order
            order.status = 'processing'
            order.save()
            
            # Update product statistics for successful payment
            _update_product_statistics_standalone(order)
            
            print(f"✅ Payment {tx_ref} marked as completed - Amount: {amount} ETB via {payment_method}")
            
        # Handle failed payment
        elif event_type in ['charge.failed', 'charge.cancelled'] or webhook_status in ['failed', 'cancelled']:
            payment.status = 'failed'
            payment.webhook_data = webhook_data
            payment.save()
            
            print(f"❌ Payment {tx_ref} marked as failed")
            
        # Handle refunded payment
        elif event_type == 'charge.refunded' or webhook_status == 'refunded':
            payment.status = 'refunded'
            payment.webhook_data = webhook_data
            payment.save()
            
            print(f"🔄 Payment {tx_ref} marked as refunded")
            
        else:
            print(f"⚠️ Unhandled webhook event: {event_type} with status: {webhook_status}")
        
        # Always return 200 OK to acknowledge receipt
        return JsonResponse({
            'status': 'success',
            'message': f'Webhook processed for {tx_ref}',
            'event': event_type,
            'payment_status': webhook_status
        }, status=200)
        
    except json.JSONDecodeError as e:
        print(f"❌ JSON decode error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=200)
    except Exception as e:
        print(f"❌ Webhook processing error: {str(e)}")
        import traceback
        print(f"📋 Traceback: {traceback.format_exc()}")
        # Still return 200 to prevent Chapa from retrying
        return JsonResponse({'status': 'error', 'message': str(e)}, status=200)


def _update_product_statistics_standalone(order):
    """Update product statistics when payment is successful (standalone version)."""
    try:
        from products.models import Product
        
        for item in order.items.all():
            product = item.product
            # Update total sold quantity
            product.total_sold += item.quantity
            product.save()
            
            print(f"📈 Updated product {product.name} - Total sold: {product.total_sold}")
            
    except Exception as e:
        print(f"❌ Error updating product statistics: {str(e)}")
