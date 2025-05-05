from rest_framework import viewsets, permissions
from .models import OrderPayment
from .serializers import OrderPaymentSerializer
from users.permissions import IsTenantOwner


class OrderPaymentViewSet(viewsets.ModelViewSet):
    serializer_class = OrderPaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return OrderPayment.objects.none()
        if IsTenantOwner().has_permission(self.request, self):
            # Allow tenant owners to see all payments
            return OrderPayment.objects.filter(tenant=self.request.user.tenant)
        return OrderPayment.objects.filter(tenant=self.request.user.tenant, user=self.request.user)

    def perform_create(self, serializer):
        """Set tenant automatically when creating a payment."""
        serializer.save(tenant=self.request.user.tenant)
