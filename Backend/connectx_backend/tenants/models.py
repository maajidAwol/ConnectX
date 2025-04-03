import uuid
from django.db import models
from django.contrib.auth.hashers import make_password


class Tenant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    api_key = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)  # Store hashed passwords
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def save(self, *args, **kwargs):
        """Ensure password is always hashed before saving."""
        if not self.password.startswith("pbkdf2_sha256$"):  # Avoid rehashing
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
