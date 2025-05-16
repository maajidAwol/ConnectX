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
            tenant.logo = upload_image(logo)
        tenant.save()

        return tenant


class TenantSerializer(serializers.ModelSerializer):
    """Serializer for the Tenant model."""

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
            "legal_name",
            "business_registration_number",
            "business_type",
            "business_bio",
            "licence_registration_date",
            "tenant_verification_status",
            "tenant_verification_date",
            "business_registration_certificate",
            "business_license",
            "tin_number",
            "vat_number",
            "tax_office_address",
            "tax_registration_certificate",
            "bank_name",
            "bank_account_number",
            "bank_account_name",
            "bank_branch",
            "bank_statement",
            "mobileapp_url",
            "mobileapp_name",
            "id_card",
            "api_key",
        ]
        read_only_fields = ["id", "api_key", "created_at", "updated_at", "is_verified"]
        extra_kwargs = {
            "password": {"write_only": True, "required": False},
            "name": {"required": False},
            "email": {"required": False},
            "logo": {"required": False},
            "business_registration_certificate": {"required": False},
            "business_license": {"required": False},
            "tax_registration_certificate": {"required": False},
            "bank_statement": {"required": False},
            "id_card": {"required": False},
        }

    def create(self, validated_data):
        """Create a new tenant."""
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

        # Create tenant instance
        tenant = super().create(validated_data)

        # Handle file uploads
        if logo:
            tenant.logo = upload_image(logo)
        if business_registration_certificate:
            tenant.business_registration_certificate = upload_image(
                business_registration_certificate
            )
        if business_license:
            tenant.business_license = upload_image(business_license)
        if tax_registration_certificate:
            tenant.tax_registration_certificate = upload_image(
                tax_registration_certificate
            )
        if bank_statement:
            tenant.bank_statement = upload_image(bank_statement)
        if id_card:
            tenant.id_card = upload_image(id_card)
        tenant.save()

        return tenant

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
            tenant.logo = upload_image(logo)
        if business_registration_certificate:
            tenant.business_registration_certificate = upload_image(
                business_registration_certificate
            )
        if business_license:
            tenant.business_license = upload_image(business_license)
        if tax_registration_certificate:
            tenant.tax_registration_certificate = upload_image(
                tax_registration_certificate
            )
        if bank_statement:
            tenant.bank_statement = upload_image(bank_statement)
        if id_card:
            tenant.id_card = upload_image(id_card)
        tenant.save()

        return tenant
