from .models import ActivityLog


def log_activity(user, action, details=None, tenant=None):
    """
    Log a user activity.

    Args:
        user: The user performing the action
        action: String describing the action
        details: Optional JSON-serializable details about the action
        tenant: Optional tenant associated with the action
    """
    ActivityLog.objects.create(
        user=user,
        tenant=tenant or getattr(user, "tenant", None),
        role=user.role if hasattr(user, "role") else None,
        action=action,
        details=details,
    )
