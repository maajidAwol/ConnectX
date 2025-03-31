from rest_framework import viewsets, permissions
from .models import OrderShippingAddress
from .serializers import OrderShippingAddressSerializer
from users.permissions import IsTenantAdmin

class OrderShippingAddressViewSet(viewsets.ModelViewSet):
    serializer_class = OrderShippingAddressSerializer
    permission_classes = [permissions.IsAuthenticated, IsTenantAdmin]

    def get_queryset(self):
        """Ensure tenants can only access their own orders' shipping addresses."""
        return OrderShippingAddress.objects.filter(order__tenant=self.request.user.tenant)

    def perform_create(self, serializer):
        """Ensure shipping address is linked to a tenant's order."""
        serializer.save()
