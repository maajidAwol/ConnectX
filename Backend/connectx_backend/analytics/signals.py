from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from orders.models import Order
from products.models import Product
from tenants.models import Tenant
from analytics.models import ActivityLog
from .utils import log_activity

User = get_user_model()


@receiver(post_save, sender=Order)
def log_order_activity(sender, instance, created, **kwargs):
    if created:
        log_activity(
            user=instance.user,
            action=f"Created new order {instance.order_number}",
            details={
                "order_id": str(instance.id),
                "total_amount": float(instance.total_amount),
                "status": instance.status,
            },
            tenant=instance.tenant,
        )
    else:
        log_activity(
            user=instance.user,
            action=f"Updated order {instance.order_number}",
            details={
                "order_id": str(instance.id),
                "old_status": instance._original_status,
                "new_status": instance.status,
            },
            tenant=instance.tenant,
        )


@receiver(post_save, sender=Product)
def log_product_activity(sender, instance, created, **kwargs):
    if created:
        log_activity(
            user=instance.owner,
            action=f"Created new product {instance.name}",
            details={"product_id": str(instance.id), "price": float(instance.price)},
            tenant=instance.owner,
        )
    else:
        log_activity(
            user=instance.owner,
            action=f"Updated product {instance.name}",
            details={"product_id": str(instance.id), "price": float(instance.price)},
            tenant=instance.owner,
        )


@receiver(post_save, sender=Tenant)
def track_tenant_creation(sender, instance, created, **kwargs):
    """Track tenant creation and updates."""
    if created:
        ActivityLog.objects.create(
            tenant=instance,
            role="owner",  # Default role for tenant creation
            action="tenant_created",
            details={
                "tenant_id": str(instance.id),
                "tenant_name": instance.name,
                "tenant_type": (
                    instance.tenant_type if hasattr(instance, "tenant_type") else None
                ),
                "created_by": (
                    str(instance.created_by.id)
                    if hasattr(instance, "created_by") and instance.created_by
                    else None
                ),
            },
        )
    else:
        # Track tenant verification
        if (
            hasattr(instance, "_original_is_verified")
            and instance.is_verified
            and not instance._original_is_verified
        ):
            ActivityLog.objects.create(
                tenant=instance,
                role="admin",  # Only admins can verify tenants
                action="tenant_verified",
                details={
                    "tenant_id": str(instance.id),
                    "tenant_name": instance.name,
                    "verified_by": (
                        str(instance.verified_by.id)
                        if hasattr(instance, "verified_by") and instance.verified_by
                        else None
                    ),
                },
            )


@receiver(post_save, sender=User)
def track_user_changes(sender, instance, created, **kwargs):
    """Track user creation and role changes."""
    if created:
        ActivityLog.objects.create(
            tenant=instance.tenant if hasattr(instance, "tenant") else None,
            user=instance,
            role=instance.role,
            action="user_created",
            details={
                "user_id": str(instance.id),
                "user_email": instance.email,
                "user_name": instance.name,
                "user_role": instance.role,
                "tenant_id": str(instance.tenant.id) if instance.tenant else None,
                "tenant_name": instance.tenant.name if instance.tenant else None,
                "created_by": (
                    str(instance.created_by.id)
                    if hasattr(instance, "created_by") and instance.created_by
                    else None
                ),
            },
        )
    else:
        # Track role changes
        if (
            hasattr(instance, "_original_role")
            and instance._original_role != instance.role
        ):
            ActivityLog.objects.create(
                tenant=instance.tenant if hasattr(instance, "tenant") else None,
                user=instance,
                role=instance.role,
                action="user_role_changed",
                details={
                    "user_id": str(instance.id),
                    "user_email": instance.email,
                    "user_name": instance.name,
                    "old_role": instance._original_role,
                    "new_role": instance.role,
                    "tenant_id": str(instance.tenant.id) if instance.tenant else None,
                    "tenant_name": instance.tenant.name if instance.tenant else None,
                    "changed_by": (
                        str(instance.created_by.id)
                        if hasattr(instance, "created_by") and instance.created_by
                        else None
                    ),
                },
            )


@receiver(pre_save, sender=Tenant)
def store_tenant_original_values(sender, instance, **kwargs):
    """Store original tenant values for comparison."""
    if instance.pk:
        try:
            original = Tenant.objects.get(pk=instance.pk)
            instance._original_is_verified = original.is_verified
        except Tenant.DoesNotExist:
            pass


@receiver(pre_save, sender=User)
def store_user_original_values(sender, instance, **kwargs):
    """Store original user values for comparison."""
    if instance.pk:
        try:
            original = User.objects.get(pk=instance.pk)
            instance._original_role = original.role
        except User.DoesNotExist:
            pass
