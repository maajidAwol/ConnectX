from rest_framework import viewsets, permissions
from .models import Order
from .serializers import OrderSerializer
from users.permissions import IsTenantOwner


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Ensure tenants can only access their own orders."""
        if getattr(self, "swagger_fake_view", False):
            return Order.objects.none()
        tenant_owner_permission = IsTenantOwner()
        if tenant_owner_permission.has_permission(self, self.request, None):
            # Allow tenant owners to see all orders
            return Order.objects.filter(tenant=self.request.user.tenant)
       
        
        
        return Order.objects.filter(tenant=self.request.user.tenant, user=self.request.user)

    def perform_create(self, serializer):
        """Set tenant and user automatically on order creation."""
        serializer.save(tenant=self.request.user.tenant, user=self.request.user)
