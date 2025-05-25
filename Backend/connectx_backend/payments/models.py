import uuid
from django.db import models
from tenants.models import Tenant
from orders.models import Order
from django.db.models.signals import post_save
from django.dispatch import receiver
from users.models import User
from django.utils import timezone

class Payment(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
        ('cancelled', 'Cancelled')
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('chapa', 'Chapa'),
        ('cod', 'Cash on Delivery')
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey('orders.Order', on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    transaction_id = models.CharField(max_length=100, unique=True)
    verification_data = models.JSONField(null=True, blank=True)
    webhook_data = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.payment_method} payment for order {self.order.order_number}"
        
    def save(self, *args, **kwargs):
        # Create payment history entry on status change
        if self.pk:  # Only check for status change if payment already exists
            try:
                old_payment = Payment.objects.get(pk=self.pk)
                if old_payment.status != self.status:
                    PaymentHistory.objects.create(
                        payment=self,
                        old_status=old_payment.status,
                        new_status=self.status
                    )
            except Payment.DoesNotExist:
                pass  # This is a new payment
        super().save(*args, **kwargs)


class PaymentHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name='history')
    old_status = models.CharField(max_length=20)
    new_status = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Payment histories'
        
    def __str__(self):
        return f"Payment {self.payment.transaction_id} status changed from {self.old_status} to {self.new_status}"


@receiver(post_save, sender=Payment)
def update_order_status(sender, instance, **kwargs):
    if instance.status == 'completed':
        instance.order.status = 'completed'
        instance.order.save()