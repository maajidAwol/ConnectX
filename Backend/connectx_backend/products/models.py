import uuid
from django.db import models
from tenants.models import Tenant
from users.models import User
from categories.models import Category

class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="products")
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owned_products")
    sku = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=255)
    base_price = models.DecimalField(max_digits=8, decimal_places=2)
    profit_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    selling_price = models.DecimalField(max_digits=8, decimal_places=2)
    quantity = models.IntegerField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")
    is_public = models.BooleanField(default=False)
    description = models.TextField()
    cover_url = models.CharField(max_length=255)
    images = models.JSONField(default=list, blank=True)  # List of image URLs
    colors = models.JSONField(default=list, blank=True)  # List of colors
    sizes = models.JSONField(default=list, blank=True)  # List of sizes
    total_sold = models.IntegerField(default=0)
    total_ratings = models.IntegerField(default=0)
    total_reviews = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        """Automatically calculate selling price."""
        self.selling_price = self.base_price * (1 + self.profit_percentage / 100)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.tenant.name})"
