from rest_framework import viewsets, permissions
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer
from users.permissions import IsTenantAdmin

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated, IsTenantAdmin]

    def get_queryset(self):
        """Ensure tenants can only access their own products."""
        return Product.objects.filter(tenant=self.request.user.tenant)

    def perform_create(self, serializer):
        """Set the tenant and owner automatically on product creation."""
        serializer.save(tenant=self.request.user.tenant, owner=self.request.user)
