from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order
from analytics.models import ActivityLog


@receiver(post_save, sender=Order)
def track_order_status_change(sender, instance, **kwargs):
    """Track order status changes for analytics."""
    if (
        hasattr(instance, "_original_status")
        and instance._original_status != instance.status
    ):
        ActivityLog.objects.create(
            tenant=instance.tenant,
            activity_type="order_status_change",
            description=f"Order {instance.order_number} status changed from {instance._original_status} to {instance.status}",
            metadata={
                "order_id": str(instance.id),
                "order_number": instance.order_number,
                "old_status": instance._original_status,
                "new_status": instance.status,
                "total_amount": float(instance.total_amount),
            },
        )
