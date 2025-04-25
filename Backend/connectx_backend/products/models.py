import uuid
from django.db import models
from django.conf import settings

# Category Model
class Category(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(default='No Description', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# Product Model
class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ManyToManyField(Tenant, related_name="products_set")
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owned_products")
    sku = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(default='No Description')
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.IntegerField()
    shared_inventory = models.BooleanField(default=False)
    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='products',
        default=1  
    )
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
