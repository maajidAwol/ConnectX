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
    user_email = serializers.EmailField(source="user.email", read_only=True)
    user_name = serializers.CharField(source="user.name", read_only=True)
    tenant_name = serializers.CharField(source="tenant.name", read_only=True)
    response_time_ms = serializers.SerializerMethodField()

    class Meta:
        model = APIUsageLog
        fields = [
            "id",
            "endpoint",
            "method",
            "status_code",
            "response_time",
            "response_time_ms",
            "user",
            "user_email",
            "user_name",
            "tenant",
            "tenant_name",
            "request_data",
            "response_data",
            "timestamp",
            "ip_address",
        ]
        read_only_fields = fields

    def get_response_time_ms(self, obj):
        """Convert response time to milliseconds."""
        return round(obj.response_time * 1000, 2) if obj.response_time else None


class AdminAnalyticsOverviewSerializer(serializers.Serializer):
    total_merchants = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=15, decimal_places=2)
    total_orders = serializers.IntegerField()
    active_tenants = serializers.IntegerField()


class TenantAnalyticsOverviewSerializer(serializers.Serializer):
    total_revenue = serializers.DecimalField(max_digits=15, decimal_places=2)
    total_orders = serializers.IntegerField()
    total_products = serializers.IntegerField()
    total_customers = serializers.IntegerField()


class RecentOrderSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    order_number = serializers.CharField()
    customer_name = serializers.CharField()
    total_amount = serializers.DecimalField(max_digits=15, decimal_places=2)
    status = serializers.CharField()
    created_at = serializers.DateTimeField()


class SalesOverviewSerializer(serializers.Serializer):
    date = serializers.DateField(required=False)
    week = serializers.DateField(required=False)
    month = serializers.DateField(required=False)
    total_sales = serializers.DecimalField(max_digits=15, decimal_places=2)
    order_count = serializers.IntegerField()


class TopProductSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    name = serializers.CharField()
    total_sales = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=15, decimal_places=2)
    quantity = serializers.IntegerField()


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


class ReviewAnalyticsSerializer(serializers.Serializer):
    """Serializer for review analytics data"""

    average_rating = serializers.FloatField()
    total_reviews = serializers.IntegerField()
    rating_distribution = serializers.DictField(
        child=serializers.FloatField(),
        help_text="Percentage distribution of ratings (1-5 stars)",
    )

    class Meta:
        swagger_schema_fields = {
            "example": {
                "average_rating": 4.8,
                "total_reviews": 1248,
                "rating_distribution": {
                    "5": 85.0,
                    "4": 10.0,
                    "3": 3.0,
                    "2": 1.0,
                    "1": 1.0,
                },
            }
        }
