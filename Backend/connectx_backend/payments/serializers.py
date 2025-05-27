from rest_framework import serializers
from .models import Payment, PaymentHistory


class PaymentHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentHistory
        fields = ['id', 'old_status', 'new_status', 'created_at']


class PaymentSerializer(serializers.ModelSerializer):
    history = PaymentHistorySerializer(many=True, read_only=True)
    order_number = serializers.CharField(source='order.order_number', read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id',
            'order',
            'order_number',
            'amount',
            'payment_method',
            'status',
            'transaction_id',
            'verification_data',
            'webhook_data',
            'created_at',
            'updated_at',
            'history'
        ]
        read_only_fields = [
            'id',
            'order_number',
            'verification_data',
            'webhook_data',
            'created_at',
            'updated_at',
            'history'
        ]


class PaymentInitiationSerializer(serializers.Serializer):
    order_id = serializers.UUIDField(required=True)
    payment_method = serializers.ChoiceField(choices=Payment.PAYMENT_METHOD_CHOICES, required=True)
    return_url = serializers.URLField(required=False)
    
    class Meta:
        swagger_schema_fields = {
            "example": {
                "order_id": "order-uuid",
                "payment_method": "chapa",
                "return_url": "https://yourapp.com/payment-success"
            }
        }


class ChapaCallbackSerializer(serializers.Serializer):
    tx_ref = serializers.CharField(required=True)
    status = serializers.CharField(required=True)
    transaction_id = serializers.CharField(required=True)


class CashOnDeliveryConfirmationSerializer(serializers.Serializer):
    collected_by = serializers.CharField(required=True)
    notes = serializers.CharField(required=False, allow_blank=True)
