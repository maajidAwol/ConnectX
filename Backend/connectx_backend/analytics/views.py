from rest_framework import viewsets, permissions
from .models import Analytics
from .serializers import AnalyticsSerializer
from users.permissions import IsTenantAdmin

class AnalyticsViewSet(viewsets.ReadOnlyModelViewSet):  # Read-only analytics
    serializer_class = AnalyticsSerializer
    permission_classes = [permissions.IsAuthenticated, IsTenantAdmin]

    def get_queryset(self):
        """Tenants can only access their own analytics data."""
        return Analytics.objects.filter(tenant=self.request.user.tenant)
