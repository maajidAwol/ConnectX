import uuid
from django.db import models
from tenants.models import Tenant
from users.models import User
from categories.models import Category


class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ManyToManyField(
        Tenant, through="ProductListing", related_name="listed_products"
    )
    owner = models.ForeignKey(
        Tenant, on_delete=models.CASCADE, related_name="owned_products"
    )
    sku = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=255)
    base_price = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    profit_percentage = models.DecimalField(
        max_digits=5, decimal_places=2, default=0.00
    )
    selling_price = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    quantity = models.IntegerField(default=0)
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="products"
    )
    is_public = models.BooleanField(default=False)
    description = models.TextField(blank=True, default="")
    short_description = models.TextField(blank=True, default="")
    tag = models.JSONField(default=list, blank=True)  # List of tags
    brand = models.CharField(max_length=100, blank=True, default="")
    additional_info = models.JSONField(
        default=dict, blank=True
    )  # Dictionary for additional information
    warranty = models.CharField(max_length=100, blank=True, default="")
    cover_url = models.CharField(max_length=255, blank=True, default="")
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
        db_table = "products"

    def save(self, *args, **kwargs):
        """Automatically calculate selling price."""
        # self.selling_price = self.base_price * (1 + self.profit_percentage / 100)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.tenant.name})"


class ProductListing(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    profit_percentage = models.DecimalField(
        max_digits=5, decimal_places=2, default=0.00
    )
    selling_price = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    listed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("tenant", "product")

    def save(self, *args, **kwargs):
        from decimal import Decimal, InvalidOperation

        base_price = self.product.base_price
        # If both are provided, prioritize profit_percentage
        if base_price is not None:
            if self.profit_percentage and (
                not self.selling_price or self.selling_price == 0
            ):
                # Calculate selling_price from profit_percentage
                try:
                    profit_percentage_decimal = Decimal(self.profit_percentage)
                    self.selling_price = base_price * (
                        Decimal("1") + profit_percentage_decimal / Decimal("100")
                    )
                except (InvalidOperation, ZeroDivisionError):
                    pass
            elif self.selling_price and (
                not self.profit_percentage or self.profit_percentage == 0
            ):
                # Calculate profit_percentage from selling_price
                try:
                    selling_price_decimal = Decimal(self.selling_price)
                    self.profit_percentage = (
                        (selling_price_decimal / base_price) - Decimal("1")
                    ) * Decimal("100")
                except (InvalidOperation, ZeroDivisionError):
                    pass
            elif self.profit_percentage and self.selling_price:
                # Optionally, ensure consistency or prioritize profit_percentage
                profit_percentage_decimal = Decimal(self.profit_percentage)
                self.selling_price = base_price * (
                    Decimal("1") + profit_percentage_decimal / Decimal("100")
                )
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.tenant.name} - {self.product.name}"


#                 "description": "Latest model with advanced features.",
