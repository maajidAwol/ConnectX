from rest_framework import permissions

class IsAdminOrEntrepreneur(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_staff or request.user.is_superuser:
            return True
        if request.user.role == 'admin':
            return True
        if request.user.role == 'entrepreneur' and view.action in ['list', 'create', 'retrieve']:
            return True
        return False

class IsAdmin(permissions.BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        if request.user.is_staff or request.user.is_superuser:
            return True
        return request.user.role == 'admin'

class IsEntrepreneur(permissions.BasePermission):
    """
    Allows access only to entrepreneur users.
    """
    def has_permission(self, request, view):
        return request.user.role == 'entrepreneur'

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Object-level permission to allow only the owner (entrepreneur) or admin to access a stock request.
    """
    def has_object_permission(self, request, view, obj):
        # Admin has full access
        if request.user.is_staff or request.user.is_superuser:
            return True

        if request.user.role == 'admin':
            return True
        # Entrepreneur can only access their own stock requests
        return obj.entrepreneur == request.user
