from rest_framework import viewsets, permissions
from .models import ShippingAddress
from .serializers import ShippingAddressSerializer

class ShippingAddressViewSet(viewsets.ModelViewSet):
    serializer_class = ShippingAddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Ensure users can only access their own shipping addresses."""
        if getattr(self, 'swagger_fake_view', False):
            return ShippingAddress.objects.none()
        return ShippingAddress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Automatically associate the address with the authenticated user."""
        serializer.save(user=self.request.user)
    
