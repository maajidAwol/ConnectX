# orders/models.py
import uuid
from django.db import models
from tenants.models import Tenant
from users.models import User
from products.models import Product
from shipping.models import ShippingAddress


class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("processing", "Processing"),
        ("confirmed", "Confirmed"),
        ("shipped", "Shipped"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
        ("refunded", "Refunded"),
        ("failed", "Failed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(
        Tenant, on_delete=models.CASCADE, related_name="orders"
    )  # Selling tenant
    listing_tenant = models.ForeignKey(
        Tenant, on_delete=models.CASCADE, related_name="listed_orders", null=True
    )  # Tenant that listed the products
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="orders"
    )
    order_number = models.CharField(max_length=50, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    subtotal = models.DecimalField(max_digits=8, decimal_places=2)
    taxes = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    shipping = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    discount = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=8, decimal_places=2)
    notes = models.TextField(blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    shipping_address = models.ForeignKey(
        ShippingAddress,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="orders",
    )

    class Meta:
        ordering = ["-created_at"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._original_status = self.status

    def save(self, *args, **kwargs):
        """Automatically calculate total amount and track status changes."""
        self.total_amount = self.subtotal + self.taxes + self.shipping - self.discount
        super().save(*args, **kwargs)
        self._original_status = self.status

    def __str__(self):
        return f"Order {self.order_number} ({self.tenant.name})"


class OrderProductItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="order_items"
    )
    product_owner = models.ForeignKey(
        Tenant, on_delete=models.CASCADE, related_name="product_ordered_items"
    )
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    custom_profit_percentage = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )
    custom_selling_price = models.DecimalField(
        max_digits=8, decimal_places=2, null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        """Calculate custom selling price if a custom profit is set."""
        if self.custom_profit_percentage is not None:
            self.custom_selling_price = self.product.base_price * (
                1 + self.custom_profit_percentage / 100
            )
        else:
            self.custom_selling_price = self.product.selling_price

        # Set product owner from product
        if not self.pk and not self.product_owner_id:
            self.product_owner = self.product.owner

        super().save(*args, **kwargs)

    def __str__(self):
        return (
            f"{self.quantity} x {self.product.name} in Order {self.order.order_number}"
        )


class OrderHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="history")
    status = models.CharField(max_length=20, choices=Order.STATUS_CHOICES)
    name = models.CharField(max_length=100)
    description = models.TextField()
    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="order_status_changes"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.order.order_number} - {self.status} at {self.created_at}"
