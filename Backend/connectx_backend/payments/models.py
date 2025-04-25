import uuid
from django.db import models
from tenants.models import Tenant
from orders.models import Order

class OrderPayment(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ("chapa", "Chapa"),
        ("cash_on_delivery", "Cash on Delivery"),
    ]

    PAYMENT_STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="payments")
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="payment")
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    payment_id = models.CharField(max_length=100, null=True, blank=True)  # Chapa Transaction ID
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Payment {self.id} - {self.order.order_number} ({self.status})"
