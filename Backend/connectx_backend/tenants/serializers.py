import uuid
from rest_framework import serializers
from .models import Tenant
from utils import upload_image


class TenantCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new tenant."""

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
            "legal_name",
            "business_registration_number",
            "business_type",
            "business_bio",
        ]
        read_only_fields = ["id"]
        extra_kwargs = {
            "password": {"write_only": True},
            "logo": {"required": False},
        }

    def create(self, validated_data):
        """Create a new tenant."""
        # Handle file uploads if present
        logo = validated_data.pop("logo", None)

        # Create tenant instance
        tenant = super().create(validated_data)

        # Handle file uploads
        if logo:
            upload_result = upload_image(logo)
            if upload_result["success"]:
                tenant.logo = upload_result["url"]
        tenant.save()

        return tenant


class TenantSerializer(serializers.ModelSerializer):
    """Serializer for the Tenant model."""

    # Override URL fields to accept file uploads
    logo = serializers.FileField(required=False, write_only=True)
    business_registration_certificate = serializers.FileField(
        required=False, write_only=True
    )
    business_license = serializers.FileField(required=False, write_only=True)
    tax_registration_certificate = serializers.FileField(
        required=False, write_only=True
    )
    bank_statement = serializers.FileField(required=False, write_only=True)
    id_card = serializers.FileField(required=False, write_only=True)

    # Add read-only URL fields
    logo_url = serializers.URLField(source="logo", read_only=True)
    business_registration_certificate_url = serializers.URLField(
        source="business_registration_certificate", read_only=True
    )
    business_license_url = serializers.URLField(
        source="business_license", read_only=True
    )
    tax_registration_certificate_url = serializers.URLField(
        source="tax_registration_certificate", read_only=True
    )
    bank_statement_url = serializers.URLField(source="bank_statement", read_only=True)
    id_card_url = serializers.URLField(source="id_card", read_only=True)

    class Meta:
        model = Tenant
        fields = [
            "id",
            "name",
            "email",
            "password",
            "logo",
            "logo_url",
            "phone",
            "address",
            "website_url",
            "is_verified",
            "is_active",
            "created_at",
            "updated_at",
            "legal_name",
            "business_registration_number",
            "business_type",
            "business_bio",
            "licence_registration_date",
            "tenant_verification_status",
            "tenant_verification_date",
            "business_registration_certificate",
            "business_registration_certificate_url",
            "business_license",
            "business_license_url",
            "tin_number",
            "vat_number",
            "tax_office_address",
            "tax_registration_certificate",
            "tax_registration_certificate_url",
            "bank_name",
            "bank_account_number",
            "bank_account_name",
            "bank_branch",
            "bank_statement",
            "bank_statement_url",
            "mobileapp_url",
            "mobileapp_name",
            "id_card",
            "id_card_url",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "is_verified"]
        extra_kwargs = {
            "password": {"write_only": True, "required": False},
            "name": {"required": False},
            "email": {"required": False},
        }

    def update(self, instance, validated_data):
        """Update a tenant."""
        # Handle file uploads if present
        logo = validated_data.pop("logo", None)
        business_registration_certificate = validated_data.pop(
            "business_registration_certificate", None
        )
        business_license = validated_data.pop("business_license", None)
        tax_registration_certificate = validated_data.pop(
            "tax_registration_certificate", None
        )
        bank_statement = validated_data.pop("bank_statement", None)
        id_card = validated_data.pop("id_card", None)

        # Update tenant instance
        tenant = super().update(instance, validated_data)

        # Handle file uploads
        if logo:
            upload_result = upload_image(logo, folder="tenant_logos")
            if upload_result["success"]:
                tenant.logo = upload_result["url"]
        if business_registration_certificate:
            upload_result = upload_image(
                business_registration_certificate,
                folder="business_registration_certificates",
            )
            if upload_result["success"]:
                tenant.business_registration_certificate = upload_result["url"]
        if business_license:
            upload_result = upload_image(business_license, folder="business_licenses")
            if upload_result["success"]:
                tenant.business_license = upload_result["url"]
        if tax_registration_certificate:
            upload_result = upload_image(
                tax_registration_certificate, folder="tax_registration_certificates"
            )
            if upload_result["success"]:
                tenant.tax_registration_certificate = upload_result["url"]
        if bank_statement:
            upload_result = upload_image(bank_statement, folder="bank_statements")
            if upload_result["success"]:
                tenant.bank_statement = upload_result["url"]
        if id_card:
            upload_result = upload_image(id_card, folder="id_cards")
            if upload_result["success"]:
                tenant.id_card = upload_result["url"]
        tenant.save()

        return tenant
