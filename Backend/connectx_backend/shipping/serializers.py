from rest_framework import serializers
from .models import ShippingAddress

class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at", "user")
        swagger_schema_fields = {
            "example": {
                "label": "Home",
                "full_address": "123 Main St, City, Country",
                "phone_number": "+1234567890",
                "is_default": True,
            }
        }
