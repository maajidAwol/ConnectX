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
    # Always set a role (default to 'admin' if user is None, else use user.role or 'admin')
    role = None
    if user and hasattr(user, 'role') and user.role:
        role = user.role
    else:
        role = 'admin'  # fallback to admin if user is None or has no role
    ActivityLog.objects.create(
        user=user,
        tenant=tenant or getattr(user, "tenant", None),
        role=role,
        action=action,
        details=details,
    )
