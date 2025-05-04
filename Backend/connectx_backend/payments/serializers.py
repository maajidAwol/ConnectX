from rest_framework import serializers
from .models import OrderPayment


class OrderPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderPayment
        fields = [
            "id",
            "tenant",
            "order",
            "payment_method",
            "payment_id",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ("id", "created_at", "updated_at")
        swagger_schema_fields = {
            "example": {
                "tenant": "tenant-uuid",
                "order": "order-uuid",
                "payment_method": "chapa",
                "payment_id": "chapa-tx-123456",
                "status": "approved",
            }
        }
