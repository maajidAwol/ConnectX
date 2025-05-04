from rest_framework import permissions

class IsTenantOwner(permissions.BasePermission):
    """
    Custom permission to allow only tenant admins to modify resources.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.role == "owner" or request.user.role == "admin")
