from django.forms import DecimalField
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, AllowAny
from django.db.models import (
    Sum,
    Count,
    Q,
    F,
    Avg,
    Case,
    When,
    Value,
    IntegerField,
    DecimalField as DBDecimalField,
)
from django.db.models.functions import (
    TruncDate,
    TruncWeek,
    TruncMonth,
    TruncHour,
    Length,
    Substr,
    ExtractWeekDay,
)
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
    TenantAnalyticsOverviewSerializer,
    RecentOrderSerializer,
    SalesOverviewSerializer,
    TopProductSerializer,
)
from tenants.models import Tenant
from orders.models import Order
from users.models import User
from products.models import Product
from dateutil.relativedelta import relativedelta

from users.permissions import IsTenantMember
from django.db.models.functions import Coalesce


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

        # Base queryset with endpoint validation
        api_stats_qs = APIUsageLog.objects.filter(endpoint__isnull=False).exclude(
            endpoint=""
        )

        # Apply filters
        if start_date:
            api_stats_qs = api_stats_qs.filter(timestamp__gte=start_date)
        if end_date:
            api_stats_qs = api_stats_qs.filter(timestamp__lte=end_date)
        if method:
            api_stats_qs = api_stats_qs.filter(method=method.upper())
        if status_code:
            api_stats_qs = api_stats_qs.filter(status_code=status_code)

        # Aggregate statistics with normalized endpoint paths
        api_stats = (
            api_stats_qs.values("method")
            .annotate(
                endpoint=Case(
                    When(
                        endpoint="/",
                        then=Value("/"),
                    ),
                    When(
                        endpoint__endswith="/",
                        then=Substr(F("endpoint"), 1, Length(F("endpoint")) - 1),
                    ),
                    default=F("endpoint"),
                ),
            )
            .values("endpoint", "method")
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

    @swagger_auto_schema(
        operation_description="Get monthly revenue distribution for the past 12 months",
        responses={200: "Monthly revenue data for graph visualization"},
    )
    @action(detail=False, methods=["get"])
    def monthly_revenue_graph(self, request):
        """Get monthly revenue data for the past 12 months."""

        end_date = timezone.now()
        end_date = end_date.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        start_date = end_date - relativedelta(months=12)

        # Generate all months between start_date and end_date (inclusive)
        months = []
        current = start_date
        for _ in range(13):
            months.append(current)
            # Move to next month
            if current.month == 12:
                current = current.replace(year=current.year + 1, month=1)
            else:
                current = current.replace(month=current.month + 1)

        # Query revenue per month
        monthly_revenue = (
            Order.objects.filter(
                created_at__gte=months[0],
                created_at__lt=months[-1] + relativedelta(months=1),
                status__in=["confirmed", "shipped", "delivered"],
            )
            .annotate(month=TruncMonth("created_at"))
            .values("month")
            .annotate(revenue=Sum("total_amount"))
        )

        # Normalize month keys to (year, month) tuple for matching
        revenue_map = {
            (item["month"].year, item["month"].month): float(item["revenue"] or 0)
            for item in monthly_revenue
        }
        labels = [dt.strftime("%B %Y") for dt in months]
        values = [revenue_map.get((dt.year, dt.month), 0) for dt in months]
        data = {"labels": labels, "values": values}
        return Response(data)

    @swagger_auto_schema(
        operation_description="Get new merchants distribution for the past 12 months",
        responses={200: "Monthly new merchants data for graph visualization"},
    )
    @action(detail=False, methods=["get"])
    def new_merchants_graph(self, request):
        """Get new merchants data for the past 12 months."""

        end_date = timezone.now()
        end_date = end_date.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        start_date = end_date - relativedelta(months=12)

        # Generate all months between start_date and end_date (inclusive)
        months = []
        current = start_date
        for _ in range(13):
            months.append(current)
            if current.month == 12:
                current = current.replace(year=current.year + 1, month=1)
            else:
                current = current.replace(month=current.month + 1)

        monthly_merchants = (
            User.objects.filter(
                created_at__gte=months[0],
                created_at__lt=months[-1] + relativedelta(months=1),
                role__in=["owner", "member"],
            )
            .annotate(month=TruncMonth("created_at"))
            .values("month")
            .annotate(count=Count("id"))
        )
        merchant_map = {
            (item["month"].year, item["month"].month): int(item["count"] or 0)
            for item in monthly_merchants
        }
        labels = [dt.strftime("%B %Y") for dt in months]
        values = [merchant_map.get((dt.year, dt.month), 0) for dt in months]
        data = {"labels": labels, "values": values}
        return Response(data)

    @swagger_auto_schema(
        operation_description="Get transaction distribution by weekday",
        responses={200: "Daily transaction data for graph visualization"},
    )
    @action(detail=False, methods=["get"])
    def weekday_transactions_graph(self, request):
        """Get transaction distribution by weekday."""
        end_date = timezone.now()
        start_date = end_date - timedelta(
            days=30
        )  # Last 30 days for better distribution

        weekday_transactions = (
            Order.objects.filter(
                created_at__range=[start_date, end_date],
                status__in=["confirmed", "shipped", "delivered"],
            )
            .annotate(weekday=ExtractWeekDay("created_at"))
            .values("weekday")
            .annotate(
                count=Count("id"),
                revenue=Sum("total_amount"),
            )
            .order_by("weekday")
        )

        # Map weekday numbers to names
        weekday_names = {
            1: "Monday",
            2: "Tuesday",
            3: "Wednesday",
            4: "Thursday",
            5: "Friday",
            6: "Saturday",
            7: "Sunday",
        }

        # Build a map from weekday number to (count, revenue)
        weekday_map = {
            item["weekday"]: {
                "count": item["count"],
                "revenue": float(item["revenue"] or 0),
            }
            for item in weekday_transactions
        }
        labels = [weekday_names[i] for i in range(1, 8)]
        counts = [weekday_map.get(i, {"count": 0})["count"] for i in range(1, 8)]
        revenue = [weekday_map.get(i, {"revenue": 0.0})["revenue"] for i in range(1, 8)]
        data = {
            "labels": labels,
            "counts": counts,
            "revenue": revenue,
        }

        return Response(data)

    @swagger_auto_schema(
        operation_description="Get API usage distribution by main endpoints",
        responses={200: "API usage data by main endpoints for graph visualization"},
    )
    @action(detail=False, methods=["get"])
    def api_endpoints_graph(self, request):
        """Get API usage distribution by main endpoints."""
        end_date = timezone.now()
        start_date = end_date - timedelta(days=30)  # Last 30 days

        # Get all logs for the period
        logs = APIUsageLog.objects.filter(
            timestamp__range=[start_date, end_date],
            endpoint__isnull=False,
        ).exclude(endpoint="")

        # Define main endpoint categories
        endpoint_categories = {
            "products": ["/api/products", "/products"],
            "tenants": ["/api/tenants", "/tenants"],
            "analytics": ["/api/analytics", "/analytics"],
            "orders": ["/api/orders", "/orders"],
            "users": ["/api/users", "/users"],
            "auth": ["/api/auth", "/auth"],
        }

        # Initialize category counts
        category_stats = {category: 0 for category in endpoint_categories.keys()}

        # Count requests for each category
        for log in logs:
            for category, patterns in endpoint_categories.items():
                if any(log.endpoint.startswith(pattern) for pattern in patterns):
                    category_stats[category] += 1
                    break

        data = {
            "labels": list(category_stats.keys()),
            "values": list(category_stats.values()),
        }

        return Response(data)


class AnalyticsViewSet(viewsets.ViewSet):
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


class TenantAnalyticsViewSet(viewsets.ViewSet):
    permission_classes = [IsTenantMember]
    pagination_class = CustomPagination

    def get_tenant(self, request):
        return request.user.tenant

    @swagger_auto_schema(
        operation_description="Get tenant dashboard overview",
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
        responses={200: TenantAnalyticsOverviewSerializer()},
    )
    @action(detail=False, methods=["get"])
    def overview(self, request):
        tenant = self.get_tenant(request)

        # Get date filters
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        # Base querysets
        orders_qs = Order.objects.filter(tenant=tenant)
        products_qs = Product.objects.filter(tenant=tenant)
        customers_qs = User.objects.filter(tenant=tenant, role="customer")

        # Apply date filters if provided
        if start_date:
            orders_qs = orders_qs.filter(created_at__gte=start_date)
            products_qs = products_qs.filter(created_at__gte=start_date)
            customers_qs = customers_qs.filter(created_at__gte=start_date)
        if end_date:
            orders_qs = orders_qs.filter(created_at__lte=end_date)
            products_qs = products_qs.filter(created_at__lte=end_date)
            customers_qs = customers_qs.filter(created_at__lte=end_date)

        # Calculate metrics
        total_revenue = (
            orders_qs.filter(
                status__in=["confirmed", "shipped", "delivered"]
            ).aggregate(total=Sum("total_amount"))["total"]
            or 0
        )
        total_orders = orders_qs.count()
        total_products = products_qs.count()
        total_customers = customers_qs.count()

        data = {
            "total_revenue": total_revenue,
            "total_orders": total_orders,
            "total_products": total_products,
            "total_customers": total_customers,
        }

        serializer = TenantAnalyticsOverviewSerializer(data)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_description="Get recent orders",
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
                "status",
                openapi.IN_QUERY,
                description="Order status",
                type=openapi.TYPE_STRING,
                required=False,
            ),
        ],
        responses={200: RecentOrderSerializer(many=True)},
    )
    @action(detail=False, methods=["get"])
    def recent_orders(self, request):
        tenant = self.get_tenant(request)

        # Get filters
        status = request.query_params.get("status")

        # Base queryset
        orders = Order.objects.filter(tenant=tenant).select_related("user")

        # Apply filters
        if status:
            orders = orders.filter(status=status)

        # Order by most recent
        orders = orders.order_by("-created_at")

        # Apply pagination
        paginator = self.pagination_class()
        paginated_orders = paginator.paginate_queryset(orders, request)

        # Serialize orders
        orders_data = [
            {
                "id": order.id,
                "order_number": order.order_number,
                "customer_name": order.user.name,
                "total_amount": order.total_amount,
                "status": order.status,
                "created_at": order.created_at,
            }
            for order in paginated_orders
        ]

        serializer = RecentOrderSerializer(orders_data, many=True)
        return paginator.get_paginated_response(serializer.data)

    @swagger_auto_schema(
        operation_description="Get sales overview",
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
                "interval",
                openapi.IN_QUERY,
                description="Time interval (daily, weekly, monthly)",
                type=openapi.TYPE_STRING,
                required=False,
            ),
            openapi.Parameter(
                "order_by",
                openapi.IN_QUERY,
                description="Order by field (date, total_sales, order_count)",
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
        responses={200: SalesOverviewSerializer(many=True)},
    )
    @action(detail=False, methods=["get"])
    def sales_overview(self, request):
        tenant = self.get_tenant(request)

        # Get filters
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")
        interval = request.query_params.get("interval", "daily")

        # Get ordering parameters
        order_by = request.query_params.get("order_by", "date")
        order_direction = request.query_params.get("order", "asc")

        # Validate order_by field
        valid_order_fields = ["date", "total_sales", "order_count"]
        if order_by not in valid_order_fields:
            order_by = "date"

        # Validate order direction
        if order_direction not in ["asc", "desc"]:
            order_direction = "asc"

        # Build order_by string
        order_by_str = f"{'-' if order_direction == 'desc' else ''}{order_by}"

        # Set default date range if not provided
        if not end_date:
            end_date = timezone.now().date()
        if not start_date:
            if interval == "daily":
                start_date = end_date - timedelta(days=30)
            elif interval == "weekly":
                start_date = end_date - timedelta(weeks=12)
            else:  # monthly
                start_date = end_date - timedelta(days=365)

        # Base queryset
        orders = Order.objects.filter(
            tenant=tenant,
            status__in=["confirmed", "shipped", "delivered"],
            created_at__range=[start_date, end_date],
        )

        # Group by interval
        if interval == "daily":
            orders = (
                orders.annotate(date=TruncDate("created_at"))
                .values("date")
                .annotate(total_sales=Sum("total_amount"), order_count=Count("id"))
                .order_by(order_by_str)
            )
        elif interval == "weekly":
            orders = (
                orders.annotate(week=TruncWeek("created_at"))
                .values("week")
                .annotate(total_sales=Sum("total_amount"), order_count=Count("id"))
                .order_by(order_by_str)
            )
        else:  # monthly
            orders = (
                orders.annotate(month=TruncMonth("created_at"))
                .values("month")
                .annotate(total_sales=Sum("total_amount"), order_count=Count("id"))
                .order_by(order_by_str)
            )

        # Apply pagination
        paginator = self.pagination_class()
        paginated_orders = paginator.paginate_queryset(orders, request)
        serializer = SalesOverviewSerializer(paginated_orders, many=True)
        return paginator.get_paginated_response(serializer.data)

    @swagger_auto_schema(
        operation_description="Get top products",
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
                description="Order by field (total_sales, total_revenue, quantity)",
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
        responses={200: TopProductSerializer(many=True)},
    )
    @action(detail=False, methods=["get"])
    def top_products(self, request):
        tenant = self.get_tenant(request)

        # Get date filters
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        # Get ordering parameters
        order_by = request.query_params.get("order_by", "total_sales")
        order_direction = request.query_params.get("order", "desc")

        # Validate order_by field
        valid_order_fields = ["total_sales", "total_revenue", "quantity"]
        if order_by not in valid_order_fields:
            order_by = "total_sales"

        # Validate order direction
        if order_direction not in ["asc", "desc"]:
            order_direction = "desc"

        # Build order_by string
        order_by_str = f"{'-' if order_direction == 'desc' else ''}{order_by}"

        # Base queryset
        products = Product.objects.filter(tenant=tenant)

        # Apply date filters if provided
        if start_date:
            products = products.filter(created_at__gte=start_date)
        if end_date:
            products = products.filter(created_at__lte=end_date)

        # Annotate with proper output fields
        products = products.annotate(
            total_sales=Coalesce(
                Count("order_items", distinct=True),
                Value(0),
                output_field=IntegerField(),
            ),
            total_revenue=Coalesce(
                Sum(
                    F("order_items__quantity") * F("order_items__price"),
                    output_field=DBDecimalField(max_digits=15, decimal_places=2),
                ),
                Value(0),
                output_field=DBDecimalField(max_digits=15, decimal_places=2),
            ),
        ).order_by(order_by_str)

        # Apply pagination
        paginator = self.pagination_class()
        paginated_products = paginator.paginate_queryset(products, request)

        # Serialize products
        products_data = [
            {
                "id": product.id,
                "name": product.name,
                "total_sales": product.total_sales or 0,
                "total_revenue": float(product.total_revenue or 0),
                "quantity": product.quantity,
            }
            for product in paginated_products
        ]

        serializer = TopProductSerializer(products_data, many=True)
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
                "action",
                openapi.IN_QUERY,
                description="Activity action type",
                type=openapi.TYPE_STRING,
                required=False,
            ),
        ],
        responses={200: RecentActivitySerializer(many=True)},
    )
    @action(detail=False, methods=["get"])
    def recent_activities(self, request):
        tenant = self.get_tenant(request)

        # Get filters
        action = request.query_params.get("action")

        # Base queryset
        activities = ActivityLog.objects.filter(tenant=tenant).select_related("user")

        # Apply filters
        if action:
            activities = activities.filter(action=action)

        # Order by most recent
        activities = activities.order_by("-timestamp")

        # Apply pagination
        paginator = self.pagination_class()
        paginated_activities = paginator.paginate_queryset(activities, request)
        serializer = RecentActivitySerializer(paginated_activities, many=True)
        return paginator.get_paginated_response(serializer.data)


class APIUsageLogViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminUser]
    pagination_class = CustomPagination

    @swagger_auto_schema(
        operation_description="Get detailed API usage logs",
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
                "endpoint",
                openapi.IN_QUERY,
                description="API endpoint path",
                type=openapi.TYPE_STRING,
                required=False,
            ),
            openapi.Parameter(
                "user",
                openapi.IN_QUERY,
                description="User ID",
                type=openapi.TYPE_STRING,
                required=False,
            ),
            openapi.Parameter(
                "tenant",
                openapi.IN_QUERY,
                description="Tenant ID",
                type=openapi.TYPE_STRING,
                required=False,
            ),
        ],
        responses={200: APIUsageLogSerializer(many=True)},
    )
    @action(detail=False, methods=["get"])
    def logs(self, request):
        """Get detailed API usage logs with filtering options."""
        # Get filters
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")
        method = request.query_params.get("method")
        status_code = request.query_params.get("status_code")
        endpoint = request.query_params.get("endpoint")
        user_id = request.query_params.get("user")
        tenant_id = request.query_params.get("tenant")

        # Base queryset
        logs = APIUsageLog.objects.select_related("user", "tenant")

        # Apply filters
        if start_date:
            logs = logs.filter(timestamp__gte=start_date)
        if end_date:
            logs = logs.filter(timestamp__lte=end_date)
        if method:
            logs = logs.filter(method=method.upper())
        if status_code:
            logs = logs.filter(status_code=status_code)
        if endpoint:
            logs = logs.filter(endpoint__icontains=endpoint)
        if user_id:
            logs = logs.filter(user_id=user_id)
        if tenant_id:
            logs = logs.filter(tenant_id=tenant_id)

        # Order by most recent
        logs = logs.order_by("-timestamp")

        # Apply pagination
        paginator = self.pagination_class()
        paginated_logs = paginator.paginate_queryset(logs, request)
        serializer = APIUsageLogSerializer(paginated_logs, many=True)
        return paginator.get_paginated_response(serializer.data)

    @swagger_auto_schema(
        operation_description="Get API usage statistics by endpoint",
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
                "interval",
                openapi.IN_QUERY,
                description="Time interval (hourly, daily, weekly, monthly)",
                type=openapi.TYPE_STRING,
                required=False,
            ),
            openapi.Parameter(
                "order_by",
                openapi.IN_QUERY,
                description="Order by field (total_calls, avg_response_time, success_rate, error_rate)",
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
        responses={200: "API usage statistics by endpoint"},
    )
    @action(detail=False, methods=["get"])
    def endpoint_stats(self, request):
        """Get API usage statistics grouped by endpoint."""
        # Get filters
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")
        interval = request.query_params.get("interval", "daily")

        # Get ordering parameters
        order_by = request.query_params.get("order_by", "total_calls")
        order_direction = request.query_params.get("order", "desc")

        # Validate order_by field
        valid_order_fields = [
            "total_calls",
            "avg_response_time",
            "success_rate",
            "error_rate",
        ]
        if order_by not in valid_order_fields:
            order_by = "total_calls"

        # Validate order direction
        if order_direction not in ["asc", "desc"]:
            order_direction = "desc"

        # Build order_by string
        order_by_str = f"{'-' if order_direction == 'desc' else ''}{order_by}"

        # Set default date range if not provided
        if not end_date:
            end_date = timezone.now()
        if not start_date:
            if interval == "hourly":
                start_date = end_date - timedelta(hours=24)
            elif interval == "daily":
                start_date = end_date - timedelta(days=30)
            elif interval == "weekly":
                start_date = end_date - timedelta(weeks=12)
            else:  # monthly
                start_date = end_date - timedelta(days=365)

        # Base queryset with endpoint validation
        logs = APIUsageLog.objects.filter(
            timestamp__range=[start_date, end_date],
            endpoint__isnull=False,
        ).exclude(endpoint="")

        # Group by interval
        if interval == "hourly":
            logs = logs.annotate(period=TruncHour("timestamp"))
        elif interval == "daily":
            logs = logs.annotate(period=TruncDate("timestamp"))
        elif interval == "weekly":
            logs = logs.annotate(period=TruncWeek("timestamp"))
        else:  # monthly
            logs = logs.annotate(period=TruncMonth("timestamp"))

        # Aggregate statistics with normalized endpoint paths
        stats = (
            logs.values("method")
            .annotate(
                endpoint=Case(
                    When(
                        endpoint="/",
                        then=Value("/"),
                    ),
                    When(
                        endpoint__endswith="/",
                        then=Substr(F("endpoint"), 1, Length(F("endpoint")) - 1),
                    ),
                    default=F("endpoint"),
                ),
                period=F("period"),
            )
            .values("endpoint", "method", "period")
            .annotate(
                total_calls=Count("id"),
                avg_response_time=Avg("response_time"),
                success_rate=Count("status_code", filter=Q(status_code__lt=400))
                * 100.0
                / Count("id"),
                error_rate=Count("status_code", filter=Q(status_code__gte=400))
                * 100.0
                / Count("id"),
            )
            .order_by(order_by_str)
        )

        # Apply pagination
        paginator = self.pagination_class()
        paginated_stats = paginator.paginate_queryset(list(stats), request)
        return paginator.get_paginated_response(paginated_stats)

    @swagger_auto_schema(
        operation_description="Get API usage statistics by tenant",
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
                description="Order by field (total_calls, avg_response_time, success_rate, error_rate, unique_endpoints)",
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
        responses={200: "API usage statistics by tenant"},
    )
    @action(detail=False, methods=["get"])
    def tenant_stats(self, request):
        """Get API usage statistics grouped by tenant."""
        # Get filters
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        # Get ordering parameters
        order_by = request.query_params.get("order_by", "total_calls")
        order_direction = request.query_params.get("order", "desc")

        # Validate order_by field
        valid_order_fields = [
            "total_calls",
            "avg_response_time",
            "success_rate",
            "error_rate",
            "unique_endpoints",
        ]
        if order_by not in valid_order_fields:
            order_by = "total_calls"

        # Validate order direction
        if order_direction not in ["asc", "desc"]:
            order_direction = "desc"

        # Build order_by string
        order_by_str = f"{'-' if order_direction == 'desc' else ''}{order_by}"

        # Set default date range if not provided
        if not end_date:
            end_date = timezone.now()
        if not start_date:
            start_date = end_date - timedelta(days=30)

        # Base queryset
        logs = APIUsageLog.objects.filter(
            timestamp__range=[start_date, end_date]
        ).select_related("tenant")

        # Aggregate statistics
        stats = (
            logs.values("tenant__name")
            .annotate(
                total_calls=Count("id"),
                avg_response_time=Avg("response_time"),
                success_rate=Count("status_code", filter=Q(status_code__lt=400))
                * 100.0
                / Count("id"),
                error_rate=Count("status_code", filter=Q(status_code__gte=400))
                * 100.0
                / Count("id"),
                unique_endpoints=Count("endpoint", distinct=True),
            )
            .order_by(order_by_str)
        )

        # Apply pagination
        paginator = self.pagination_class()
        paginated_stats = paginator.paginate_queryset(list(stats), request)
        return paginator.get_paginated_response(paginated_stats)

    @swagger_auto_schema(
        operation_description="Get API usage statistics by user",
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
                description="Order by field (total_calls, avg_response_time, success_rate, error_rate, unique_endpoints)",
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
        responses={200: "API usage statistics by user"},
    )
    @action(detail=False, methods=["get"])
    def user_stats(self, request):
        """Get API usage statistics grouped by user."""
        # Get filters
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        # Get ordering parameters
        order_by = request.query_params.get("order_by", "total_calls")
        order_direction = request.query_params.get("order", "desc")

        # Validate order_by field
        valid_order_fields = [
            "total_calls",
            "avg_response_time",
            "success_rate",
            "error_rate",
            "unique_endpoints",
        ]
        if order_by not in valid_order_fields:
            order_by = "total_calls"

        # Validate order direction
        if order_direction not in ["asc", "desc"]:
            order_direction = "desc"

        # Build order_by string
        order_by_str = f"{'-' if order_direction == 'desc' else ''}{order_by}"

        # Set default date range if not provided
        if not end_date:
            end_date = timezone.now()
        if not start_date:
            start_date = end_date - timedelta(days=30)

        # Base queryset
        logs = APIUsageLog.objects.filter(
            timestamp__range=[start_date, end_date]
        ).select_related("user")

        # Aggregate statistics
        stats = (
            logs.values("user__email", "user__name")
            .annotate(
                total_calls=Count("id"),
                avg_response_time=Avg("response_time"),
                success_rate=Count("status_code", filter=Q(status_code__lt=400))
                * 100.0
                / Count("id"),
                error_rate=Count("status_code", filter=Q(status_code__gte=400))
                * 100.0
                / Count("id"),
                unique_endpoints=Count("endpoint", distinct=True),
            )
            .order_by(order_by_str)
        )

        # Apply pagination
        paginator = self.pagination_class()
        paginated_stats = paginator.paginate_queryset(list(stats), request)
        return paginator.get_paginated_response(paginated_stats)
