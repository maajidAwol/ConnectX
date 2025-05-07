import uuid
from django.db import models
from django.contrib.auth.hashers import make_password


class Tenant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)  # Store hashed passwords
    logo = models.ImageField(
        upload_to="tenant_logos/", null=True, blank=True, max_length=500
    )
    phone = models.CharField(max_length=20, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    website_url = models.URLField(max_length=500, null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Business Information
    legal_name = models.CharField(max_length=255, null=True, blank=True)
    business_registration_number = models.CharField(
        max_length=255, null=True, blank=True
    )
    business_type = models.CharField(max_length=255, null=True, blank=True)
    business_bio = models.TextField(null=True, blank=True)
    licence_registration_date = models.DateField(null=True, blank=True)
    tenant_verification_status = models.CharField(
        max_length=50,
        choices=[
            ("pending", "Pending"),
            ("under_reviw","Under  Reviw"),
            ("approved", "Approved"),
            ("rejected", "Rejected"),
        ],
        default="pending",
    )
    tenant_verification_date = models.DateField(null=True, blank=True)
    business_registration_certificate = models.FileField(
        upload_to="business_registration_certificates/",
        null=True,
        blank=True,
        max_length=500,
    )
    business_license = models.FileField(
        upload_to="business_licenses/", null=True, blank=True, max_length=500
    )

    # Tax Information
    tin_number = models.CharField(max_length=255, null=True, blank=True)
    vat_number = models.CharField(max_length=255, null=True, blank=True)
    tax_office_address = models.CharField(max_length=255, null=True, blank=True)
    tax_registration_certificate = models.FileField(
        upload_to="tax_registration_certificates/",
        null=True,
        blank=True,
        max_length=500,
    )

    # Banking Information
    bank_name = models.CharField(max_length=255, null=True, blank=True)
    bank_account_number = models.CharField(max_length=255, null=True, blank=True)
    bank_account_name = models.CharField(max_length=255, null=True, blank=True)
    bank_branch = models.CharField(max_length=255, null=True, blank=True)
    bank_statement = models.FileField(
        upload_to="bank_statements/", null=True, blank=True, max_length=500
    )

    # Mobile App Information
    mobileapp_url = models.URLField(max_length=500, null=True, blank=True)
    mobileapp_name = models.CharField(max_length=255, null=True, blank=True)

    # Identification Documents
    id_card = models.FileField(
        upload_to="id_cards/", null=True, blank=True, max_length=500
    )

    # API Key
    api_key = models.CharField(max_length=100, unique=True, null=True, blank=True)

    def save(self, *args, **kwargs):
        """Ensure password is always hashed before saving."""
        if not self.password.startswith("pbkdf2_sha256$"):  # Avoid rehashing
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "tenants"
