from rest_framework import viewsets, permissions
from .models import OrderPayment
from .serializers import OrderPaymentSerializer
from users.permissions import IsTenantAdmin

class OrderPaymentViewSet(viewsets.ModelViewSet):
    serializer_class = OrderPaymentSerializer
    permission_classes = [permissions.IsAuthenticated, IsTenantAdmin]

    def get_queryset(self):
        """Ensure tenants can only access their own payments."""
        return OrderPayment.objects.filter(tenant=self.request.user.tenant)

    def perform_create(self, serializer):
        """Set tenant automatically when creating a payment."""
        serializer.save(tenant=self.request.user.tenant)
