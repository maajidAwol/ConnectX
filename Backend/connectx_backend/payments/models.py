import uuid
from django.db import models
from tenants.models import Tenant
from orders.models import Order
from django.db.models.signals import post_save
from django.dispatch import receiver
from users.models import User

class OrderPayment(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ("pending", "Pending"),
        ("processing", "Processing"),
        ("completed", "Completed"),
        ("failed", "Failed"),
        ("cancelled", "Cancelled"),
        ("refunded", "Refunded"),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ("chapa", "Chapa Payment Gateway"),
        ("cod", "Cash on Delivery"),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="payments")
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="payments")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default="pending")
    
    # Chapa-specific fields
    transaction_reference = models.CharField(max_length=100, blank=True, null=True)
    checkout_url = models.URLField(blank=True, null=True)
    
    # General fields
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Payment {self.id} for Order {self.order.order_number}"


class PaymentHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    payment = models.ForeignKey(OrderPayment, on_delete=models.CASCADE, related_name="history")
    status = models.CharField(max_length=20, choices=OrderPayment.PAYMENT_STATUS_CHOICES)
    description = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="payment_status_changes")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ["-created_at"]
        
    def __str__(self):
        return f"Payment {self.payment.id} - {self.status} at {self.created_at}"


@receiver(post_save, sender=OrderPayment)
def update_order_status_on_payment_change(sender, instance, created, **kwargs):
    """Update order status when payment status changes"""
    from orders.models import OrderHistory
    
    order = instance.order
    
    # Map payment statuses to order statuses
    payment_to_order_status = {
        'approved': 'confirmed',
        'rejected': 'failed',
        'refunded': 'refunded',
        'canceled': 'cancelled',
    }
    
    # If payment status should affect order status
    if instance.status in payment_to_order_status:
        new_order_status = payment_to_order_status[instance.status]
        
        # Only update if different
        if order.status != new_order_status:
            # Update order status
            order.status = new_order_status
            order.save()
            
            # Create order history entry
            OrderHistory.objects.create(
                order=order,
                status=new_order_status,
                name=f"Order {new_order_status} via payment",
                description=f"Order status updated to {new_order_status} due to payment status: {instance.status}",
            )
    
    # Create payment history entry if created or status changed
    if created or kwargs.get('update_fields') and 'status' in kwargs.get('update_fields'):
        PaymentHistory.objects.create(
            payment=instance,
            status=instance.status,
            description=f"Payment status changed to {instance.status}",
            metadata={'automatic': True}
        )
