from rest_framework import serializers
from .models import ShippingAddress


class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = "__all__"
        swagger_schema_fields = {
            "example": {
                "id": "ship-uuid-1234-5678-90ab-cdef12345678",
                "user": "user-uuid",
                "label": "Home",
                "full_address": "123 Main St, City, Country",
                "phone_number": "+1234567890",
                "is_default": True,
                "created_at": "2025-04-30T12:00:00Z",
                "updated_at": "2025-04-30T12:00:00Z",
            }
        }
