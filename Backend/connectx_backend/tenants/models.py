import uuid
from django.db import models
from django.contrib.auth.hashers import make_password


class Tenant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)  # Store hashed passwords
    logo = models.URLField(max_length=500, null=True, blank=True)
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
            ("unverified", "Unverified"),
            ("pending", "Pending"),
            ("under_review", "Under Review"),
            ("approved", "Approved"),
            ("rejected", "Rejected"),
        ],
        default="pending",
    )
    tenant_verification_date = models.DateField(null=True, blank=True)
    business_registration_certificate = models.URLField(
        max_length=500, null=True, blank=True
    )
    business_license = models.URLField(max_length=500, null=True, blank=True)

    # Tax Information
    tin_number = models.CharField(max_length=255, null=True, blank=True)
    vat_number = models.CharField(max_length=255, null=True, blank=True)
    tax_office_address = models.CharField(max_length=255, null=True, blank=True)
    tax_registration_certificate = models.URLField(
        max_length=500, null=True, blank=True
    )

    # Banking Information
    bank_name = models.CharField(max_length=255, null=True, blank=True)
    bank_account_number = models.CharField(max_length=255, null=True, blank=True)
    bank_account_name = models.CharField(max_length=255, null=True, blank=True)
    bank_branch = models.CharField(max_length=255, null=True, blank=True)
    bank_statement = models.URLField(max_length=500, null=True, blank=True)

    # Mobile App Information
    mobileapp_url = models.URLField(max_length=500, null=True, blank=True)
    mobileapp_name = models.CharField(max_length=255, null=True, blank=True)

    # Identification Documents
    id_card = models.URLField(max_length=500, null=True, blank=True)

 

    def save(self, *args, **kwargs):
        """Ensure password is always hashed before saving."""
        if not self.password.startswith("pbkdf2_sha256$"):  # Avoid rehashing
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "tenants"
        ordering = ["-created_at", "name"]
