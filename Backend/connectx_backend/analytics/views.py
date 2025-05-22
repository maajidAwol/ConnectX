from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.db.models import Sum, Count, Q, F
from django.utils import timezone
from datetime import timedelta
from rest_framework.pagination import PageNumberPagination
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import (
    Analytics,
    SystemMetrics,
    APIUsage,
    SystemHealth,
    ActivityLog,
    APIUsageLog,
)
from .serializers import (
    AnalyticsSerializer,
    SystemMetricsSerializer,
    APIUsageSerializer,
    SystemHealthSerializer,
    AdminDashboardSerializer,
    ActivityLogSerializer,
    APIUsageLogSerializer,
    AdminAnalyticsOverviewSerializer,
    TopTenantSerializer,
    APIUsageStatsSerializer,
    RecentActivitySerializer,
)
from tenants.models import Tenant
from orders.models import Order
from users.models import User


class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


class AdminAnalyticsViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminUser]
    pagination_class = CustomPagination

    @swagger_auto_schema(
        operation_description="Get analytics overview",
        manual_parameters=[
            openapi.Parameter(
                "start_date",
                openapi.IN_QUERY,
                description="Start date (YYYY-MM-DD)",
                type=openapi.TYPE_STRING,
                required=False,
            ),
            openapi.Parameter(
                "end_date",
                openapi.IN_QUERY,
                description="End date (YYYY-MM-DD)",
                type=openapi.TYPE_STRING,
                required=False,
            ),
        ],
        responses={200: AdminAnalyticsOverviewSerializer()},
    )
    @action(detail=False, methods=["get"])
    def overview(self, request):
        # Get date filters
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        # Base queryset
        orders_qs = Order.objects.all()
        users_qs = User.objects.filter(Q(role="owner") | Q(role="member"))
        tenants_qs = Tenant.objects.all()

        # Apply date filters if provided
        if start_date:
            orders_qs = orders_qs.filter(created_at__gte=start_date)
            users_qs = users_qs.filter(created_at__gte=start_date)
            tenants_qs = tenants_qs.filter(created_at__gte=start_date)
        if end_date:
            orders_qs = orders_qs.filter(created_at__lte=end_date)
            users_qs = users_qs.filter(created_at__lte=end_date)
            tenants_qs = tenants_qs.filter(created_at__lte=end_date)

        # Get total merchants
        total_merchants = users_qs.count()

        # Get total revenue from confirmed orders
        total_revenue = (
            orders_qs.filter(
                status__in=["confirmed", "shipped", "delivered"]
            ).aggregate(total=Sum("total_amount"))["total"]
            or 0
        )

        # Get total orders
        total_orders = orders_qs.count()

        # Get active tenants
        thirty_days_ago = timezone.now() - timedelta(days=30)
        active_tenants = (
            tenants_qs.filter(orders__created_at__gte=thirty_days_ago)
            .distinct()
            .count()
        )

        data = {
            "total_merchants": total_merchants,
            "total_revenue": total_revenue,
            "total_orders": total_orders,
            "active_tenants": active_tenants,
        }

        serializer = AdminAnalyticsOverviewSerializer(data)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_description="Get top tenants by revenue",
        manual_parameters=[
            openapi.Parameter(
                "page",
                openapi.IN_QUERY,
                description="Page number",
                type=openapi.TYPE_INTEGER,
                required=False,
            ),
            openapi.Parameter(
                "page_size",
                openapi.IN_QUERY,
                description="Number of items per page",
                type=openapi.TYPE_INTEGER,
                required=False,
            ),
            openapi.Parameter(
                "start_date",
                openapi.IN_QUERY,
                description="Start date (YYYY-MM-DD)",
                type=openapi.TYPE_STRING,
                required=False,
            ),
            openapi.Parameter(
                "end_date",
                openapi.IN_QUERY,
                description="End date (YYYY-MM-DD)",
                type=openapi.TYPE_STRING,
                required=False,
            ),
            openapi.Parameter(
                "order_by",
                openapi.IN_QUERY,
                description="Order by field (total_revenue, total_orders)",
                type=openapi.TYPE_STRING,
                required=False,
            ),
            openapi.Parameter(
                "order",
                openapi.IN_QUERY,
                description="Order direction (asc, desc)",
                type=openapi.TYPE_STRING,
                required=False,
            ),
        ],
        responses={200: TopTenantSerializer(many=True)},
    )
    @action(detail=False, methods=["get"])
    def top_tenants(self, request):
        # Get date filters
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        # Get ordering parameters
        order_by = request.query_params.get("order_by", "total_revenue")
        order_direction = request.query_params.get("order", "desc")

        # Validate order_by field
        valid_order_fields = ["total_revenue", "total_orders", "tenant_name"]
        if order_by not in valid_order_fields:
            order_by = "total_revenue"

        # Validate order direction
        if order_direction not in ["asc", "desc"]:
            order_direction = "desc"

        # Build order_by string
        order_by_str = f"{'-' if order_direction == 'desc' else ''}{order_by}"

        # Base queryset
        orders_qs = Order.objects.filter(
            status__in=["confirmed", "shipped", "delivered"]
        )

        # Apply date filters if provided
        if start_date:
            orders_qs = orders_qs.filter(created_at__gte=start_date)
        if end_date:
            orders_qs = orders_qs.filter(created_at__lte=end_date)

        top_tenants = (
            orders_qs.values("tenant__name")
            .annotate(
                tenant_name=F("tenant__name"),
                total_revenue=Sum("total_amount"),
                total_orders=Count("id", distinct=True),
            )
            .order_by(order_by_str)
        )

        # Apply pagination
        paginator = self.pagination_class()
        paginated_tenants = paginator.paginate_queryset(top_tenants, request)
        serializer = TopTenantSerializer(paginated_tenants, many=True)
        return paginator.get_paginated_response(serializer.data)

    @swagger_auto_schema(
        operation_description="Get API usage statistics",
        manual_parameters=[
            openapi.Parameter(
                "page",
                openapi.IN_QUERY,
                description="Page number",
                type=openapi.TYPE_INTEGER,
                required=False,
            ),
            openapi.Parameter(
                "page_size",
                openapi.IN_QUERY,
                description="Number of items per page",
                type=openapi.TYPE_INTEGER,
                required=False,
            ),
            openapi.Parameter(
                "start_date",
                openapi.IN_QUERY,
                description="Start date (YYYY-MM-DD)",
                type=openapi.TYPE_STRING,
                required=False,
            ),
            openapi.Parameter(
                "end_date",
                openapi.IN_QUERY,
                description="End date (YYYY-MM-DD)",
                type=openapi.TYPE_STRING,
                required=False,
            ),
            openapi.Parameter(
                "method",
                openapi.IN_QUERY,
                description="HTTP method (GET, POST, PUT, DELETE)",
                type=openapi.TYPE_STRING,
                required=False,
            ),
            openapi.Parameter(
                "status_code",
                openapi.IN_QUERY,
                description="HTTP status code",
                type=openapi.TYPE_INTEGER,
                required=False,
            ),
            openapi.Parameter(
                "order_by",
                openapi.IN_QUERY,
                description="Order by field (total_calls, avg_response_time, success_rate)",
                type=openapi.TYPE_STRING,
                required=False,
            ),
            openapi.Parameter(
                "order",
                openapi.IN_QUERY,
                description="Order direction (asc, desc)",
                type=openapi.TYPE_STRING,
                required=False,
            ),
        ],
        responses={200: APIUsageStatsSerializer(many=True)},
    )
    @action(detail=False, methods=["get"])
    def api_usage(self, request):
        # Get filters
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")
        method = request.query_params.get("method")
        status_code = request.query_params.get("status_code")

        # Get ordering parameters
        order_by = request.query_params.get("order_by", "total_calls")
        order_direction = request.query_params.get("order", "desc")

        # Validate order_by field
        valid_order_fields = [
            "total_calls",
            "avg_response_time",
            "success_rate",
            "endpoint",
        ]
        if order_by not in valid_order_fields:
            order_by = "total_calls"

        # Validate order direction
        if order_direction not in ["asc", "desc"]:
            order_direction = "desc"

        # Build order_by string
        order_by_str = f"{'-' if order_direction == 'desc' else ''}{order_by}"

        # Base queryset
        api_stats_qs = APIUsageLog.objects.all()

        # Apply filters
        if start_date:
            api_stats_qs = api_stats_qs.filter(timestamp__gte=start_date)
        if end_date:
            api_stats_qs = api_stats_qs.filter(timestamp__lte=end_date)
        if method:
            api_stats_qs = api_stats_qs.filter(method=method.upper())
        if status_code:
            api_stats_qs = api_stats_qs.filter(status_code=status_code)

        api_stats = (
            api_stats_qs.values("endpoint", "method")
            .annotate(
                total_calls=Count("id"),
                avg_response_time=Sum("response_time") / Count("id"),
                success_rate=Count("status_code", filter=Q(status_code__lt=400))
                * 100.0
                / Count("id"),
            )
            .order_by(order_by_str)
        )

        # Apply pagination
        paginator = self.pagination_class()
        paginated_stats = paginator.paginate_queryset(api_stats, request)
        serializer = APIUsageStatsSerializer(paginated_stats, many=True)
        return paginator.get_paginated_response(serializer.data)

    @swagger_auto_schema(
        operation_description="Get recent activities",
        manual_parameters=[
            openapi.Parameter(
                "page",
                openapi.IN_QUERY,
                description="Page number",
                type=openapi.TYPE_INTEGER,
                required=False,
            ),
            openapi.Parameter(
                "page_size",
                openapi.IN_QUERY,
                description="Number of items per page",
                type=openapi.TYPE_INTEGER,
                required=False,
            ),
            openapi.Parameter(
                "start_date",
                openapi.IN_QUERY,
                description="Start date (YYYY-MM-DD)",
                type=openapi.TYPE_STRING,
                required=False,
            ),
            openapi.Parameter(
                "end_date",
                openapi.IN_QUERY,
                description="End date (YYYY-MM-DD)",
                type=openapi.TYPE_STRING,
                required=False,
            ),
            openapi.Parameter(
                "action",
                openapi.IN_QUERY,
                description="Activity action type",
                type=openapi.TYPE_STRING,
                required=False,
            ),
            openapi.Parameter(
                "role",
                openapi.IN_QUERY,
                description="User role",
                type=openapi.TYPE_STRING,
                required=False,
            ),
            openapi.Parameter(
                "order_by",
                openapi.IN_QUERY,
                description="Order by field (timestamp, action, role)",
                type=openapi.TYPE_STRING,
                required=False,
            ),
            openapi.Parameter(
                "order",
                openapi.IN_QUERY,
                description="Order direction (asc, desc)",
                type=openapi.TYPE_STRING,
                required=False,
            ),
        ],
        responses={200: RecentActivitySerializer(many=True)},
    )
    @action(detail=False, methods=["get"])
    def recent_activities(self, request):
        # Get filters
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")
        action = request.query_params.get("action")
        role = request.query_params.get("role")

        # Get ordering parameters
        order_by = request.query_params.get("order_by", "timestamp")
        order_direction = request.query_params.get("order", "desc")

        # Validate order_by field
        valid_order_fields = ["timestamp", "action", "role"]
        if order_by not in valid_order_fields:
            order_by = "timestamp"

        # Validate order direction
        if order_direction not in ["asc", "desc"]:
            order_direction = "desc"

        # Build order_by string
        order_by_str = f"{'-' if order_direction == 'desc' else ''}{order_by}"

        # Base queryset
        activities = ActivityLog.objects.select_related("user", "tenant")

        # Apply filters
        if start_date:
            activities = activities.filter(timestamp__gte=start_date)
        if end_date:
            activities = activities.filter(timestamp__lte=end_date)
        if action:
            activities = activities.filter(action=action)
        if role:
            activities = activities.filter(role=role)

        # Apply ordering
        activities = activities.order_by(order_by_str)

        # Apply pagination
        paginator = self.pagination_class()
        paginated_activities = paginator.paginate_queryset(activities, request)
        serializer = RecentActivitySerializer(paginated_activities, many=True)
        return paginator.get_paginated_response(serializer.data)


class AnalyticsViewSet(viewsets.ModelViewSet):
    queryset = Analytics.objects.all()
    serializer_class = AnalyticsSerializer
    permission_classes = [IsAdminUser]
    pagination_class = CustomPagination

    @swagger_auto_schema(
        operation_description="Get admin dashboard data",
        responses={200: AdminDashboardSerializer()},
    )
    @action(detail=False, methods=["get"])
    def admin_dashboard(self, request):
        # Get total merchants (admins)
        total_merchants = Tenant.objects.filter(is_active=True).count()

        # Get total revenue
        total_revenue = (
            Analytics.objects.filter(metric_type="revenue").aggregate(
                total=Sum("value")
            )["total"]
            or 0
        )

        # Get system health
        system_health = SystemHealth.objects.all()[:5]

        # Get latest system metrics
        system_metrics = SystemMetrics.objects.first()

        # Get recent API usage
        api_usage = APIUsage.objects.all()[:10]

        # Get top tenants by revenue
        top_tenants = (
            Analytics.objects.filter(metric_type="revenue")
            .values("tenant__name")
            .annotate(total_revenue=Sum("value"))
            .order_by("-total_revenue")[:5]
        )

        # Get recent activities (combining various metrics)
        recent_activities = []

        # Add recent API calls
        recent_api_calls = APIUsage.objects.all()[:5]
        for api_call in recent_api_calls:
            recent_activities.append(
                {
                    "type": "api_call",
                    "description": f"{api_call.method} {api_call.endpoint}",
                    "timestamp": api_call.timestamp,
                    "status": api_call.status_code,
                }
            )

        # Add recent system health changes
        recent_health = SystemHealth.objects.all()[:5]
        for health in recent_health:
            recent_activities.append(
                {
                    "type": "system_health",
                    "description": f"{health.component} status changed to {health.status}",
                    "timestamp": health.timestamp,
                    "status": health.status,
                }
            )

        # Sort activities by timestamp
        recent_activities.sort(key=lambda x: x["timestamp"], reverse=True)
        recent_activities = recent_activities[:10]

        data = {
            "total_merchants": total_merchants,
            "total_revenue": total_revenue,
            "system_health": system_health,
            "system_metrics": system_metrics,
            "api_usage": api_usage,
            "top_tenants": top_tenants,
            "recent_activities": recent_activities,
        }

        serializer = AdminDashboardSerializer(data)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_description="Get system metrics",
        manual_parameters=[
            openapi.Parameter(
                "page",
                openapi.IN_QUERY,
                description="Page number",
                type=openapi.TYPE_INTEGER,
                required=False,
            ),
            openapi.Parameter(
                "page_size",
                openapi.IN_QUERY,
                description="Number of items per page",
                type=openapi.TYPE_INTEGER,
                required=False,
            ),
        ],
        responses={200: SystemMetricsSerializer(many=True)},
    )
    @action(detail=False, methods=["get"])
    def system_metrics(self, request):
        metrics = SystemMetrics.objects.all()

        # Apply pagination
        paginator = self.pagination_class()
        paginated_metrics = paginator.paginate_queryset(metrics, request)
        serializer = SystemMetricsSerializer(paginated_metrics, many=True)
        return paginator.get_paginated_response(serializer.data)

    @swagger_auto_schema(
        operation_description="Get API usage statistics for the last 24 hours",
        manual_parameters=[
            openapi.Parameter(
                "page",
                openapi.IN_QUERY,
                description="Page number",
                type=openapi.TYPE_INTEGER,
                required=False,
            ),
            openapi.Parameter(
                "page_size",
                openapi.IN_QUERY,
                description="Number of items per page",
                type=openapi.TYPE_INTEGER,
                required=False,
            ),
        ],
        responses={200: APIUsageSerializer(many=True)},
    )
    @action(detail=False, methods=["get"])
    def api_usage_stats(self, request):
        # Get API usage statistics for the last 24 hours
        time_threshold = timezone.now() - timedelta(hours=24)
        api_stats = (
            APIUsage.objects.filter(timestamp__gte=time_threshold)
            .values("endpoint")
            .annotate(
                total_calls=Count("id"),
                avg_response_time=Sum("response_time") / Count("id"),
                success_rate=Count("status_code", filter=Q(status_code__lt=400))
                * 100.0
                / Count("id"),
            )
        )

        # Apply pagination
        paginator = self.pagination_class()
        paginated_stats = paginator.paginate_queryset(api_stats, request)
        return paginator.get_paginated_response(paginated_stats)

    @swagger_auto_schema(
        operation_description="Get top performing tenants",
        manual_parameters=[
            openapi.Parameter(
                "page",
                openapi.IN_QUERY,
                description="Page number",
                type=openapi.TYPE_INTEGER,
                required=False,
            ),
            openapi.Parameter(
                "page_size",
                openapi.IN_QUERY,
                description="Number of items per page",
                type=openapi.TYPE_INTEGER,
                required=False,
            ),
        ],
        responses={200: TopTenantSerializer(many=True)},
    )
    @action(detail=False, methods=["get"])
    def top_performing_tenants(self, request):
        # Get top performing tenants based on revenue
        top_tenants = (
            Analytics.objects.filter(metric_type="revenue")
            .values("tenant__name")
            .annotate(
                total_revenue=Sum("value"),
                total_orders=Count("id", filter=Q(metric_type="orders")),
            )
            .order_by("-total_revenue")
        )

        # Apply pagination
        paginator = self.pagination_class()
        paginated_tenants = paginator.paginate_queryset(top_tenants, request)
        return paginator.get_paginated_response(paginated_tenants)
