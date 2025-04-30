from rest_framework import serializers
from .models import OrderPayment


class OrderPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderPayment
        fields = "__all__"
        swagger_schema_fields = {
            "example": {
                "id": "pay-uuid-1234-5678-90ab-cdef12345678",
                "tenant": "tenant-uuid",
                "order": "order-uuid",
                "payment_method": "chapa",
                "payment_id": "chapa-tx-123456",
                "status": "approved",
                "created_at": "2025-04-30T12:00:00Z",
                "updated_at": "2025-04-30T12:00:00Z",
            }
        }
