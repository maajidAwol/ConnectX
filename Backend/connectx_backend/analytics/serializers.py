from rest_framework import serializers
from .models import (
    Analytics,
    SystemMetrics,
    APIUsage,
    SystemHealth,
    ActivityLog,
    APIUsageLog,
)
from tenants.serializers import TenantSerializer
from users.serializers import UserSerializer


class AnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analytics
        fields = "__all__"
        swagger_schema_fields = {
            "example": {
                "id": "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
                "tenant": "tenant-uuid",
                "product": "product-uuid",
                "metric_type": "sales",
                "value": "1500.00",
                "date": "2025-04-30",
                "created_at": "2025-04-30T12:00:00Z",
            }
        }


class SystemMetricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemMetrics
        fields = "__all__"


class APIUsageSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(source="tenant.name", read_only=True)

    class Meta:
        model = APIUsage
        fields = "__all__"


class SystemHealthSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemHealth
        fields = "__all__"


class ActivityLogSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    tenant = TenantSerializer(read_only=True)

    class Meta:
        model = ActivityLog
        fields = "__all__"


class APIUsageLogSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    tenant = TenantSerializer(read_only=True)

    class Meta:
        model = APIUsageLog
        fields = "__all__"


class AdminAnalyticsOverviewSerializer(serializers.Serializer):
    total_merchants = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=15, decimal_places=2)
    total_orders = serializers.IntegerField()
    active_tenants = serializers.IntegerField()


class TopTenantSerializer(serializers.Serializer):
    tenant_name = serializers.CharField()
    total_revenue = serializers.DecimalField(max_digits=15, decimal_places=2)
    total_orders = serializers.IntegerField()


class APIUsageStatsSerializer(serializers.Serializer):
    endpoint = serializers.CharField()
    method = serializers.CharField()
    total_calls = serializers.IntegerField()
    avg_response_time = serializers.FloatField()
    success_rate = serializers.FloatField()


class RecentActivitySerializer(serializers.Serializer):
    user = UserSerializer()
    tenant = TenantSerializer()
    role = serializers.CharField()
    action = serializers.CharField()
    timestamp = serializers.DateTimeField()
    details = serializers.JSONField(required=False)


class AdminDashboardSerializer(serializers.Serializer):
    total_merchants = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=15, decimal_places=2)
    system_health = SystemHealthSerializer(many=True)
    system_metrics = SystemMetricsSerializer()
    api_usage = APIUsageSerializer(many=True)
    top_tenants = serializers.ListField(
        child=serializers.DictField(child=serializers.CharField())
    )
    recent_activities = serializers.ListField(
        child=serializers.DictField(child=serializers.CharField())
    )
