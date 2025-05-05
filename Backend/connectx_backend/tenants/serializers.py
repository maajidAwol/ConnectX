from rest_framework import serializers
from .models import Tenant


class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = [
            "id",
            "name",
            "api_key",
            "email",
            "created_at",
            "updated_at",
            "logo",
            "business_type",
            "business_bio",
            "website_url",
        ]
        read_only_fields = ["id", "api_key", "created_at", "updated_at"]
        swagger_schema_fields = {
            "example": {
                "id": "tenant-uuid-1234-5678-90ab-cdef12345678",
                "name": "Acme Corp",
                "api_key": "api-key-123456",
                "email": "info@acme.com",
                "created_at": "2025-04-30T12:00:00Z",
                "updated_at": "2025-04-30T12:00:00Z",
                "logo": "https://example.com/logo.png",
                "business_type": "Retail",
                "business_bio": "Leading retailer of electronics.",
                "website_url": "https://acme.com",
            }
        }
