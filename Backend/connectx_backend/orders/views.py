from rest_framework import viewsets, permissions
from .models import Order
from .serializers import OrderSerializer
from users.permissions import IsTenantAdmin


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsTenantAdmin]

    def get_queryset(self):
        """Ensure tenants can only access their own orders."""
        if getattr(self, "swagger_fake_view", False):
            return Order.objects.none()
        if not self.request.user.is_authenticated:
            return Order.objects.none()
        return Order.objects.filter(tenant=self.request.user.tenant)

    def perform_create(self, serializer):
        """Set tenant and user automatically on order creation."""
        serializer.save(tenant=self.request.user.tenant, user=self.request.user)
