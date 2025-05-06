import uuid
from django.db import models
from django.contrib.auth.hashers import make_password


class Tenant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    legal_name = models.CharField(max_length=255, null=True, blank=True)
    business_registration_number = models.CharField(max_length=255, null=True, blank=True)
    

    api_key = models.CharField(max_length=100, unique=True, null=True, blank=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)  # Store hashed passwords
    logo = models.ImageField(upload_to='tenant_logos/', null=True, blank=True)
    business_type = models.CharField(max_length=255, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    mobileapp_url = models.URLField(max_length=500, null=True, blank=True)
    mobileapp_name = models.CharField(max_length=255, null=True, blank=True)
    licence_registration_date = models.DateField(null=True, blank=True)
    tenant_verification_status = models.CharField(max_length=50, choices=[ 
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    ], default='pending')
    tenant_verification_date = models.DateField(null=True, blank=True)
    
    business_bio = models.TextField(null=True, blank=True)
    website_url = models.URLField(max_length=500, null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def save(self, *args, **kwargs):
        """Ensure password is always hashed before saving."""
        if not self.password.startswith("pbkdf2_sha256$"):  # Avoid rehashing
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    class Meta:
        db_table = 'tenants'
