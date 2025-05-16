from rest_framework import serializers
from .models import OrderPayment, PaymentHistory
from orders.serializers import OrderSerializer, MinimalTenantSerializer, MinimalUserSerializer


class PaymentHistorySerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.name', read_only=True)
    
    class Meta:
        model = PaymentHistory
        fields = [
            "id",
            "status",
            "description",
            "created_by_name",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class OrderPaymentSerializer(serializers.ModelSerializer):
    history = PaymentHistorySerializer(many=True, read_only=True)
    order_number = serializers.CharField(source='order.order_number', read_only=True)
    
    class Meta:
        model = OrderPayment
        fields = [
            "id",
            "order",
            "order_number",
            "amount",
            "payment_method",
            "status",
            "transaction_reference",
            "checkout_url",
            "notes",
            "created_at",
            "updated_at",
            "history",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class ChapaRequestSerializer(serializers.Serializer):
    """
    Serializer for initiating a Chapa payment
    """
    order_id = serializers.UUIDField(required=True)
    return_url = serializers.URLField(required=False, allow_blank=True, allow_null=True)
    callback_url = serializers.URLField(required=False, allow_blank=True, allow_null=True)
    email = serializers.EmailField(required=False)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    metadata = serializers.JSONField(required=False)


class ChapaResponseSerializer(serializers.Serializer):
    """
    Serializer for Chapa payment response
    """
    checkout_url = serializers.URLField()
    tx_ref = serializers.CharField()
    status = serializers.CharField()
    message = serializers.CharField()
    payment_id = serializers.UUIDField()


class CashOnDeliverySerializer(serializers.Serializer):
    """
    Serializer for Cash on Delivery payment
    """
    order_id = serializers.UUIDField(required=True)
    notes = serializers.CharField(required=False, allow_blank=True)


class PaymentInitiationSerializer(serializers.Serializer):
    order_id = serializers.UUIDField(required=True)
    payment_method = serializers.ChoiceField(choices=OrderPayment.PAYMENT_METHOD_CHOICES, required=True)
    return_url = serializers.URLField(required=False, help_text="URL to redirect the user after payment (Chapa only)")
    notes = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        swagger_schema_fields = {
            "example": {
                "order_id": "order-uuid",
                "payment_method": "chapa",
                "return_url": "https://yourapp.com/payment-success",
                "notes": "Payment for order #123"
            }
        }


class ChapaCallbackSerializer(serializers.Serializer):
    """
    Serializer for Chapa payment gateway callback data
    """
    tx_ref = serializers.CharField()
    transaction_id = serializers.CharField()
    status = serializers.CharField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)


class CashOnDeliveryConfirmationSerializer(serializers.Serializer):
    """
    Serializer for confirming a Cash on Delivery payment
    """
    payment_id = serializers.UUIDField(required=True)
    collected_by = serializers.CharField(required=True)
    notes = serializers.CharField(required=False, allow_blank=True)
