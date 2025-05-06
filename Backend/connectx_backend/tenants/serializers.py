import uuid
from rest_framework import serializers
from .models import Tenant
from pathlib import Path
import sys
# from connectx_backend.utils import upload_image
sys.path.insert(0, str(Path(__file__).parent.parent))
from utils import upload_image


class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = [
            "id",
            "name",
            "email",
            "password",
            "logo",
            "phone",
            "address",
            "website_url",
            "is_verified",
            "is_active",
            "created_at",
            "updated_at",
            # Business Information
            "legal_name",
            "business_registration_number",
            "business_type",
            "business_bio",
            "licence_registration_date",
            "tenant_verification_status",
            "tenant_verification_date",
            "business_registration_certificate",
            "business_license",
            # Tax Information
            "tin_number",
            "vat_number",
            "tax_office_address",
            "tax_registration_certificate",
            # Banking Information
            "bank_name",
            "bank_account_number",
            "bank_account_name",
            "bank_branch",
            "bank_statement",
            # Mobile App Information
            "mobileapp_url",
            "mobileapp_name",
            # Identification Documents
            "id_card",
            # API Key
            "api_key",
        ]
        read_only_fields = [
            "id", "api_key", "created_at", "updated_at", "is_verified", "tenant_verification_date", "tenant_verification_status"
        ]
        extra_kwargs = {
            "password": {"write_only": True},
            "logo": {"required": False, "allow_null": True},
            "business_registration_certificate": {"required": False, "allow_null": True},
            "business_license": {"required": False, "allow_null": True},
            "tax_registration_certificate": {"required": False, "allow_null": True},
            "bank_statement": {"required": False, "allow_null": True},
            "id_card": {"required": False, "allow_null": True},
        }
        swagger_schema_fields = {
            "example": {
                "id": "tenant-uuid-1234-5678-90ab-cdef12345678",
                "name": "Acme Corp",
                "email": "info@acme.com",
                "password": "yourpassword",
                "logo": "https://example.com/logo.png",
                "phone": "+1234567890",
                "address": "123 Main St, City, Country",
                "website_url": "https://acme.com",
                "is_verified": False,
                "is_active": True,
                "created_at": "2025-04-30T12:00:00Z",
                "updated_at": "2025-04-30T12:00:00Z",
                "legal_name": "Acme Corporation Ltd.",
                "business_registration_number": "BRN-123456",
                "business_type": "Retail",
                "business_bio": "Leading retailer of electronics.",
                "licence_registration_date": "2025-01-01",
                "tenant_verification_status": "pending",
                "tenant_verification_date": None,
                "business_registration_certificate": "https://example.com/cert.pdf",
                "business_license": "https://example.com/license.pdf",
                "tin_number": "TIN-123456",
                "vat_number": "VAT-654321",
                "tax_office_address": "Tax Office St, City",
                "tax_registration_certificate": "https://example.com/tax_cert.pdf",
                "bank_name": "BankX",
                "bank_account_number": "1234567890",
                "bank_account_name": "Acme Corp",
                "bank_branch": "Main Branch",
                "bank_statement": "https://example.com/bank_statement.pdf",
                "mobileapp_url": "https://app.acme.com",
                "mobileapp_name": "AcmeApp",
                "id_card": "https://example.com/id_card.pdf",
                "api_key": "api-key-123456",
            }
        }
        swagger_extra_kwargs = {
            "logo": {"type": "file", "required": False},
            "business_registration_certificate": {"type": "file", "required": False},
            "business_license": {"type": "file", "required": False},
            "tax_registration_certificate": {"type": "file", "required": False},
            "bank_statement": {"type": "file", "required": False},
            "id_card": {"type": "file", "required": False},
        }

    def create(self, validated_data):
        request = self.context.get("request")
        files = request.FILES if request else None
        tenant_id = validated_data.get("id") or str(uuid.uuid4())
        upload_fields = [
            "logo",
            "business_registration_certificate",
            "business_license",
            "tax_registration_certificate",
            "bank_statement",
            "id_card",
        ]
        for field in upload_fields:
            file_obj = files.get(field) if files else None
            if file_obj:
                folder = f"tenants/{tenant_id}/{field}"
                result = upload_image(file_obj, folder=folder)
                if result.get("success"):
                    validated_data[field] = result["url"]
        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context.get("request")
        files = request.FILES if request else None
        tenant_id = str(instance.id)
        upload_fields = [
            "logo",
            "business_registration_certificate",
            "business_license",
            "tax_registration_certificate",
            "bank_statement",
            "id_card",
        ]
        for field in upload_fields:
            file_obj = files.get(field) if files else None
            if file_obj:
                folder = f"tenants/{tenant_id}/{field}"
                result = upload_image(file_obj, folder=folder)
                if result.get("success"):
                    validated_data[field] = result["url"]
        return super().update(instance, validated_data)
