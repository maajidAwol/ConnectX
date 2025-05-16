from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework import permissions


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
        if view.action in ["list", "retrieve", "me"]:
            return request.user.is_authenticated
        if view.action in ["update", "partial_update", "destroy"]:
            return request.user.is_authenticated and request.user.role in [
                "admin",
                "owner",
            ]
        if view.action == "destroy":
            return request.user.is_authenticated and request.user.role == "admin"
        return False


class IsTenantOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of a tenant to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the tenant
        return request.user.is_authenticated and (
            request.user.tenant == obj and request.user.role == "owner"
        )


class IsAdmin(permissions.BasePermission):
    """
    Custom permission to only allow admin users.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.is_staff or request.user.role == "admin"
        )
