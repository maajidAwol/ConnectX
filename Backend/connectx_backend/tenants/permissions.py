from rest_framework.permissions import BasePermission, SAFE_METHODS


class TenantPermission(BasePermission):
    """
    Custom permission for TenantViewSet:
    - Anyone can create (POST)
    - Only admin can list all tenants (GET list)
    - Authenticated users can view their own tenant (GET retrieve)
    - Only owner or admin can update
    """

    def has_permission(self, request, view):
        if view.action == "create":
            return True
        if view.action in ["list", "retrieve","me"]:
            return request.user.is_authenticated
        if view.action in ["update", "partial_update","destroy"]:
            return request.user.is_authenticated and request.user.role in [
                "admin",
                "owner",
            ]
        if view.action == "destroy":
            return request.user.is_authenticated and request.user.role == "admin"
        return False
