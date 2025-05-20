from rest_framework.permissions import BasePermission

class HasValidAPIKey(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request, "tenant") and request.tenant is not None
