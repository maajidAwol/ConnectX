from rest_framework.permissions import BasePermission

class IsVerifiedBuyer(BasePermission):
    """Only users who purchased the product can leave reviews."""

    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user
