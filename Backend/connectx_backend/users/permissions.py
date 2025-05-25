from rest_framework import permissions


class IsTenantOwner(permissions.BasePermission):
    """
    Custom permission to allow only tenant admins to modify resources.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.role == "owner" or request.user.role == "admin"
        )


class IsTenantMember(permissions.BasePermission):
    """
    custom permission to allow members to modify the resource
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.role == "owner"
            or request.user.role == "admin"
            or request.user.role == "member"
        )


class CanDeleteMember(permissions.BasePermission):
    """
    Custom permission to only allow admins and owners to delete members.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.role == "admin" or request.user.role == "owner"
        )

    def has_object_permission(self, request, view, obj):
        # Only allow if the user is an admin or owner
        if not (request.user.role == "admin" or request.user.role == "owner"):
            return False

        # If user is an owner, they can only delete members from their tenant
        if request.user.role == "owner":
            return obj.tenant == request.user.tenant

        # Admins can delete any member
        return True
