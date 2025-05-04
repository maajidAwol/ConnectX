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
        ("shipped", "Shipped"),
        ("delivered", "Delivered"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="orders")
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

    def save(self, *args, **kwargs):
        """Automatically calculate total amount."""
        self.total_amount = self.subtotal + self.taxes + self.shipping - self.discount
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order {self.order_number} ({self.tenant.name})"


class OrderProductItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="order_items"
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
        super().save(*args, **kwargs)

    def __str__(self):
        return (
            f"{self.quantity} x {self.product.name} in Order {self.order.order_number}"
        )


class OrderHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="history")
    name = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
