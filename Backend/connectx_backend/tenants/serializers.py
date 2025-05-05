from rest_framework import serializers
from .models import Tenant


class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = [
            "id",
            "name",
            "legal_name",
            "business_registration_number",
            "api_key",
            "email",
            # 'password',  # Excluded for security; handle separately if needed
            "logo",
            "business_type",
            "phone",
            "address",
            "mobileapp_url",
            "mobileapp_name",
            "licence_registration_date",
            "tenant_verification_status",
            "tenant_verification_date",
            "business_bio",
            "website_url",
            "is_verified",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "api_key", "created_at", "updated_at","is_verified","tenant_verification_date","tenant_verification_status"]
        swagger_schema_fields = {
            "example": {
                "id": "tenant-uuid-1234-5678-90ab-cdef12345678",
                "name": "Acme Corp",
                "legal_name": "Acme Corporation Ltd.",
                "business_registration_number": "BRN-123456",
                "api_key": "api-key-123456",
                "email": "info@acme.com",
                "logo": "https://example.com/logo.png",
                "business_type": "Retail",
                "phone": "+1234567890",
                "address": "123 Main St, City, Country",
                "mobileapp_url": "https://app.acme.com",
                "mobileapp_name": "AcmeApp",
                "licence_registration_date": "2025-01-01",
                "tenant_verification_status": "pending",
                "tenant_verification_date": None,
                "business_bio": "Leading retailer of electronics.",
                "website_url": "https://acme.com",
                "is_verified": False,
                "is_active": True,
                "created_at": "2025-04-30T12:00:00Z",
                "updated_at": "2025-04-30T12:00:00Z",
            }
        }
