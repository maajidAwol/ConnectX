from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from .models import Category
from .serializers import CategorySerializer
from users.permissions import IsTenantAdmin  # Ensure only admins can modify categories


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated, IsTenantAdmin]

    def get_queryset(self):
        """Ensure tenants can only access their own categories."""
        if getattr(self, "swagger_fake_view", False):
            return Category.objects.none()
        if not self.request.user.is_authenticated:
            return Category.objects.none()
        return Category.objects.filter(tenant=self.request.user.tenant)

    def perform_create(self, serializer):
        """Set the tenant automatically on category creation."""
        if not self.request.user.is_authenticated:
            raise PermissionDenied("Authentication is required.")
        serializer.save(tenant=self.request.user.tenant)
