from rest_framework import viewsets, permissions
from .models import Analytics
from .serializers import AnalyticsSerializer
from users.permissions import IsTenantOwner


class AnalyticsViewSet(viewsets.ReadOnlyModelViewSet):  # Read-only analytics
    serializer_class = AnalyticsSerializer
    permission_classes = [permissions.IsAuthenticated, IsTenantOwner]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Analytics.objects.none()
        if not self.request.user.is_authenticated:
            return Analytics.objects.none()
        return Analytics.objects.filter(tenant=self.request.user.tenant)
