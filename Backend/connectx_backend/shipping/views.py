from rest_framework import viewsets, permissions
from .models import OrderShippingAddress
from .serializers import OrderShippingAddressSerializer

class OrderShippingAddressViewSet(viewsets.ModelViewSet):
    serializer_class = OrderShippingAddressSerializer
    permission_classes = [permissions.IsAuthenticated,]

    def get_queryset(self):
        """Ensure tenants can only access their own orders' shipping addresses."""
        if getattr(self, 'swagger_fake_view', False):
            return OrderShippingAddress.objects.none()
        if not self.request.user.is_authenticated:
            return OrderShippingAddress.objects.none()
        return OrderShippingAddress.objects.filter(order__tenant=self.request.user.tenant)

    def perform_create(self, serializer):
        """Ensure shipping address is linked to a tenant's order."""
        serializer.save()
