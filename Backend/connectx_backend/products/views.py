from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import Product
from .serializers import ProductSerializer
from users.permissions import IsTenantAdmin


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated, IsTenantAdmin]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Product.objects.none()
        if not self.request.user.is_authenticated:
            return Product.objects.none()
        return Product.objects.filter(tenant=self.request.user.tenant)

    def perform_create(self, serializer):
        if not self.request.user.is_authenticated:
            raise PermissionDenied("Authentication is required.")
        serializer.save(seller=self.request.user)
