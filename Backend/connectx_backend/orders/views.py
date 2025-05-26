from rest_framework import viewsets, permissions, status
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.utils import timezone
import datetime
import uuid
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import ValidationError

# Import for custom filter set
from django_filters import FilterSet, CharFilter, ModelChoiceFilter

from .models import Order, OrderHistory, OrderProductItem, RefundRequest, Refund
from .serializers import (
    OrderSerializer,
    OrderListSerializer,
    WriteOrderSerializer,
    RefundRequestSerializer,
    RefundSerializer,
)
from users.permissions import IsTenantMember
from rest_framework.permissions import IsAuthenticated

from core.pagination import CustomPagination
from users.models import User

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


# Custom FilterSet to avoid _set_choices issues
class OrderFilter(FilterSet):
    status = CharFilter(field_name="status")
    user = ModelChoiceFilter(queryset=User.objects.all())
    user_email = CharFilter(field_name="user__email", lookup_expr="icontains")
    user_name = CharFilter(field_name="user__name", lookup_expr="icontains")

    class Meta:
        model = Order
        fields = ["status", "user", "user_email", "user_name"]


class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = OrderFilter
    search_fields = ["order_number", "user__name", "user__email"]
    ordering_fields = ["created_at", "updated_at", "total_amount"]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        """Use different serializers for different actions."""
        if self.action in ["create", "update", "partial_update"]:
            return WriteOrderSerializer
        elif self.action == "list" or self.action in [
            "sales",
            "listings",
            "products",
            "my_orders",
            "by_customer",
        ]:
            return OrderListSerializer
        return OrderSerializer

    def get_queryset(self):
        """Ensure tenants can only access their own orders."""
        if getattr(self, "swagger_fake_view", False):
            return Order.objects.none()

        user = self.request.user
        tenant = user.tenant

        # Filter by date range if provided
        start_date = self.request.query_params.get("start_date")
        end_date = self.request.query_params.get("end_date")
        status_param = self.request.query_params.get("status")
        user_param = self.request.query_params.get("user")
        user_email = self.request.query_params.get("user_email")
        user_name = self.request.query_params.get("user_name")

        queryset = Order.objects.all()

        # Robust date filtering
        if start_date:
            try:
                start_datetime = datetime.datetime.strptime(start_date, "%Y-%m-%d")
                if timezone.is_naive(start_datetime):
                    start_datetime = timezone.make_aware(
                        start_datetime, timezone.get_default_timezone()
                    )
                queryset = queryset.filter(created_at__gte=start_datetime)
            except ValueError:
                from rest_framework.exceptions import ValidationError

                raise ValidationError(
                    {"start_date": "Invalid date format. Use YYYY-MM-DD."}
                )

        if end_date:
            try:
                end_datetime = datetime.datetime.strptime(end_date, "%Y-%m-%d").replace(
                    hour=23, minute=59, second=59
                )
                if timezone.is_naive(end_datetime):
                    end_datetime = timezone.make_aware(
                        end_datetime, timezone.get_default_timezone()
                    )
                queryset = queryset.filter(created_at__lte=end_datetime)
            except ValueError:
                from rest_framework.exceptions import ValidationError

                raise ValidationError(
                    {"end_date": "Invalid date format. Use YYYY-MM-DD."}
                )

        if status_param:
            queryset = queryset.filter(status=status_param)
        if user_param:
            queryset = queryset.filter(user_id=user_param)
        if user_email:
            queryset = queryset.filter(user__email__icontains=user_email)
        if user_name:
            queryset = queryset.filter(user__name__icontains=user_name)

        tenant_owner_permission = IsTenantMember()
        if tenant_owner_permission.has_permission(self.request, self):
            return queryset.filter(
                Q(tenant=tenant) | Q(items__product_owner=tenant)
            ).distinct()
        return queryset.filter(user=user)

    @swagger_auto_schema(
        operation_summary="Create a new order",
        operation_description="""
        Creates a new order with the provided items. 
        
        The following fields are automatically determined:
        - seller_tenant: Can be explicitly provided as 'selling_tenant_id' in the request or determined from authenticated user's tenant
        - user: Set to current authenticated user
        - order_number: Generated automatically
        
        Simply provide the order details and items, everything else is handled automatically.
        
        To specify a selling tenant, include the 'selling_tenant_id' UUID field in your request.
        """,
        request_body=OrderSerializer,
        responses={
            201: OrderSerializer,
            400: "Bad Request - Invalid input data",
            401: "Unauthorized - Authentication required",
        },
    )
    def create(self, serializer):
        return super().create(serializer)

    def perform_create(self, serializer):
        """Set tenant and user automatically on order creation."""
        user = self.request.user

        # Generate a unique order number
        today = datetime.datetime.now()
        date_str = today.strftime("%Y%m%d")

        # Get the count of orders today + 1
        today_start = datetime.datetime.combine(today.date(), datetime.time.min)
        today_orders_count = (
            Order.objects.filter(created_at__gte=today_start).count() + 1
        )

        # Format: ORD-YYYYMMDD-XXXX (XXXX is sequential number)
        order_number = f"ORD-{date_str}-{today_orders_count:04d}"

        # Get selling tenant from request if provided, otherwise use user's tenant
        selling_tenant_id = serializer.validated_data.pop("selling_tenant_id", None)
        selling_tenant = None

        if selling_tenant_id:
            # If selling tenant ID is provided in the request, use it
            from tenants.models import Tenant

            try:
                selling_tenant = Tenant.objects.get(id=selling_tenant_id)
            except Tenant.DoesNotExist:
                selling_tenant = (
                    user.tenant
                )  # Fallback to user's tenant if ID is invalid
        else:
            # Use the authenticated user's tenant
            selling_tenant = user.tenant

        # Save the order with the seller tenant and user info
        serializer.save(tenant=selling_tenant, user=user, order_number=order_number)

    @swagger_auto_schema(
        operation_summary="Get order list",
        operation_description="Retrieves a list of orders based on the user's role. Tenant owners can see all orders related to their tenant, while regular users can only see their own orders.",
        manual_parameters=[
            openapi.Parameter(
                "status",
                openapi.IN_QUERY,
                description="Filter by order status",
                type=openapi.TYPE_STRING,
                enum=[status[0] for status in Order.STATUS_CHOICES],
                required=False,
            ),
            openapi.Parameter(
                "start_date",
                openapi.IN_QUERY,
                description="Filter orders created on or after this date (YYYY-MM-DD)",
                type=openapi.TYPE_STRING,
                required=False,
            ),
            openapi.Parameter(
                "end_date",
                openapi.IN_QUERY,
                description="Filter orders created on or before this date (YYYY-MM-DD)",
                type=openapi.TYPE_STRING,
                required=False,
            ),
            openapi.Parameter(
                "search",
                openapi.IN_QUERY,
                description="Search by order number, user name, or user email",
                type=openapi.TYPE_STRING,
                required=False,
            ),
        ],
        responses={
            200: OrderSerializer(many=True),
            401: "Unauthorized - Authentication required",
        },
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Get order details",
        operation_description="Retrieves the details of a specific order, including order items and history.",
        responses={
            200: OrderSerializer,
            401: "Unauthorized - Authentication required",
            404: "Not Found - Order not found",
        },
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Update order status",
        operation_description="Update the status of an order and create a history entry for the status change",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "status": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    enum=[status[0] for status in Order.STATUS_CHOICES],
                ),
                "description": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Description of the status change",
                ),
            },
            required=["status"],
        ),
        responses={
            200: OrderSerializer,
            400: "Bad request - Invalid status",
            403: "Permission denied",
            404: "Not found - Order not found",
        },
    )
    @action(detail=True, methods=["post"], url_path="update-status")
    def update_status(self, request, pk=None):
        """Update the status of an order and create a history entry."""
        order = self.get_object()
        status = request.data.get("status")
        description = request.data.get("description", f"Status changed to {status}")

        if not status:
            return Response(
                {"error": "Status is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        if status not in [s[0] for s in Order.STATUS_CHOICES]:
            return Response(
                {
                    "error": f"Invalid status. Must be one of: {', '.join([s[0] for s in Order.STATUS_CHOICES])}"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Update order status
        old_status = order.status
        order.status = status
        order.save()

        # Create history entry
        OrderHistory.objects.create(
            order=order,
            status=status,
            name=f"Order {status}",
            description=description,
            created_by=request.user,
        )

        # Return the updated order
        serializer = self.get_serializer(order)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_summary="Get customer orders",
        operation_description="Retrieves all orders for a specific customer. Only accessible by tenant owners.",
        manual_parameters=[
            openapi.Parameter(
                "customer_id",
                openapi.IN_QUERY,
                description="Customer ID (UUID)",
                type=openapi.TYPE_STRING,
                format=openapi.FORMAT_UUID,
                required=True,
            )
        ],
        responses={
            200: OrderSerializer(many=True),
            400: "Bad request - Missing customer_id",
            403: "Permission denied - Only tenant owners can access",
            404: "Not found - Customer not found",
        },
    )
    @action(detail=False, methods=["get"], url_path="customer-orders")
    def by_customer(self, request):
        """Get all orders for a specific customer (only for tenant owners)."""
        customer_id = request.query_params.get("customer_id")

        if not customer_id:
            return Response(
                {"error": "customer_id is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Only tenant owners can access other users' orders
        if not IsTenantMember().has_permission(request, self):
            return Response(
                {"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN
            )

        # Get orders for this customer where the current tenant is involved
        tenant = request.user.tenant
        queryset = (
            Order.objects.filter(user_id=customer_id)
            .filter(
                Q(tenant=tenant)  # Orders where this tenant is the selling tenant
                | Q(
                    items__product_owner=tenant
                )  # Orders with products owned by this tenant
            )
            .distinct()
        )

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_summary="Get tenant sales orders",
        operation_description="Retrieves all orders where the current tenant is the selling tenant (handling the order fulfillment)",
        manual_parameters=[
            openapi.Parameter(
                "status",
                openapi.IN_QUERY,
                description="Filter by order status",
                type=openapi.TYPE_STRING,
                enum=[status[0] for status in Order.STATUS_CHOICES],
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
        ],
        responses={
            200: OrderSerializer(many=True),
            401: "Unauthorized - Authentication required",
        },
    )
    @action(detail=False, methods=["get"], url_path="tenant-sales")
    def sales(self, request):
        """Get all orders where the current tenant is the selling tenant."""
        tenant = request.user.tenant
        status_filter = request.query_params.get("status")

        queryset = Order.objects.filter(tenant=tenant)

        if status_filter:
            queryset = queryset.filter(status=status_filter)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_summary="Get tenant listing orders",
        operation_description="Retrieves all orders where the current tenant is the listing tenant (not fulfilling but listed the products)",
        manual_parameters=[
            openapi.Parameter(
                "status",
                openapi.IN_QUERY,
                description="Filter by order status",
                type=openapi.TYPE_STRING,
                enum=[status[0] for status in Order.STATUS_CHOICES],
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
        ],
        responses={
            200: OrderSerializer(many=True),
            401: "Unauthorized - Authentication required",
        },
    )
    @action(detail=False, methods=["get"], url_path="tenant-listings")
    def listings(self, request):
        """Get all orders where the current tenant is the listing tenant."""
        tenant = request.user.tenant
        status_filter = request.query_params.get("status")

        queryset = Order.objects.filter(listing_tenant=tenant)

        if status_filter:
            queryset = queryset.filter(status=status_filter)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_summary="Get orders with tenant's products",
        operation_description="Retrieves all orders containing products owned by the current tenant, regardless of which tenant is selling or listing them",
        manual_parameters=[
            openapi.Parameter(
                "status",
                openapi.IN_QUERY,
                description="Filter by order status",
                type=openapi.TYPE_STRING,
                enum=[status[0] for status in Order.STATUS_CHOICES],
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
        ],
        responses={
            200: OrderSerializer(many=True),
            401: "Unauthorized - Authentication required",
        },
    )
    @action(detail=False, methods=["get"], url_path="tenant-product-orders")
    def products(self, request):
        """Get all orders containing products owned by the current tenant."""
        tenant = request.user.tenant
        status_filter = request.query_params.get("status")

        queryset = Order.objects.filter(items__product_owner=tenant).distinct()

        if status_filter:
            queryset = queryset.filter(status=status_filter)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_summary="Get current user's orders",
        operation_description="Retrieves all orders placed by the current authenticated user",
        manual_parameters=[
            openapi.Parameter(
                "status",
                openapi.IN_QUERY,
                description="Filter by order status",
                type=openapi.TYPE_STRING,
                enum=[status[0] for status in Order.STATUS_CHOICES],
                required=False,
            )
        ],
        responses={
            200: OrderSerializer(many=True),
            401: "Unauthorized - Authentication required",
        },
    )
    @action(detail=False, methods=["get"], url_path="my-orders")
    def my_orders(self, request):
        """Get all orders for the current authenticated user."""
        user = request.user
        status_filter = request.query_params.get("status")

        queryset = Order.objects.filter(user=user)

        if status_filter:
            queryset = queryset.filter(status=status_filter)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_summary="Confirm order delivery",
        operation_description="Allows a buyer to confirm they have received their order. This updates the order status to 'delivered'.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "feedback": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Optional feedback about the delivery",
                )
            },
        ),
        responses={
            200: OrderSerializer,
            400: "Bad request - Order is not in a deliverable state",
            403: "Forbidden - Not the order owner",
            404: "Not found - Order not found",
        },
    )
    @action(detail=True, methods=["post"], url_path="confirm-delivery")
    def confirm_delivery(self, request, pk=None):
        """Confirm that an order has been delivered and received by the buyer."""
        order = self.get_object()

        # Only the buyer can confirm delivery
        if order.user != request.user:
            return Response(
                {"error": "Only the buyer can confirm delivery"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Check if the order is in a state where delivery can be confirmed
        if order.status not in ["shipped", "processing"]:
            return Response(
                {
                    "error": f"Cannot confirm delivery for an order in '{order.status}' status"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Update order status to delivered
        old_status = order.status
        order.status = "delivered"
        order.save()

        # Create history entry
        feedback = request.data.get("feedback", "Delivery confirmed by buyer")
        OrderHistory.objects.create(
            order=order,
            status="delivered",
            name="Order delivered",
            description=feedback,
            created_by=request.user,
        )

        # Return the updated order
        serializer = self.get_serializer(order)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_summary="Get tenant order statistics",
        operation_description="Provides statistics about orders related to the current tenant, including counts of owned vs. resold products.",
        manual_parameters=[
            openapi.Parameter(
                "start_date",
                openapi.IN_QUERY,
                description="Start date for statistics (YYYY-MM-DD)",
                type=openapi.TYPE_STRING,
                required=False,
            ),
            openapi.Parameter(
                "end_date",
                openapi.IN_QUERY,
                description="End date for statistics (YYYY-MM-DD)",
                type=openapi.TYPE_STRING,
                required=False,
            ),
        ],
        responses={
            200: "Order statistics",
            401: "Unauthorized - Authentication required",
            403: "Forbidden - Only tenant owners can access",
        },
    )
    @action(detail=False, methods=["get"], url_path="tenant-statistics")
    def tenant_statistics(self, request):
        """Get statistics about orders related to the current tenant."""
        # Only tenant owners can access statistics
        tenant_owner_permission = IsTenantMember()
        if not tenant_owner_permission.has_permission(self.request, self):
            return Response(
                {"error": "Only tenant owners can access order statistics"},
                status=status.HTTP_403_FORBIDDEN,
            )

        tenant = request.user.tenant

        # Filter by date range if provided
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        # Base querysets
        all_orders_queryset = Order.objects.all()

        # Apply date filters if provided
        if start_date:
            try:
                start_datetime = datetime.datetime.strptime(
                    start_date, "%Y-%m-%d"
                ).replace(tzinfo=timezone.utc)
                all_orders_queryset = all_orders_queryset.filter(
                    created_at__gte=start_datetime
                )
            except ValueError:
                pass

        if end_date:
            try:
                end_datetime = datetime.datetime.strptime(end_date, "%Y-%m-%d").replace(
                    hour=23, minute=59, second=59, tzinfo=timezone.utc
                )
                all_orders_queryset = all_orders_queryset.filter(
                    created_at__lte=end_datetime
                )
            except ValueError:
                pass

        # Count orders by type
        total_selling_orders = all_orders_queryset.filter(tenant=tenant).count()
        total_listing_orders = all_orders_queryset.filter(listing_tenant=tenant).count()

        # Count orders containing products owned by the tenant
        total_product_orders = (
            all_orders_queryset.filter(items__product_owner=tenant).distinct().count()
        )

        # Get counts by status for orders where tenant is seller
        status_counts = {}
        for status_choice in Order.STATUS_CHOICES:
            status_code = status_choice[0]
            status_counts[status_code] = all_orders_queryset.filter(
                tenant=tenant, status=status_code
            ).count()

        # Get stats on product orders
        # Count of orders with products owned and sold by tenant
        owned_and_sold = (
            all_orders_queryset.filter(tenant=tenant, items__product_owner=tenant)
            .distinct()
            .count()
        )

        # Count of orders with products owned by tenant but sold by others
        owned_not_sold = (
            all_orders_queryset.filter(~Q(tenant=tenant), items__product_owner=tenant)
            .distinct()
            .count()
        )

        # Count of orders with products not owned by tenant but sold by tenant
        sold_not_owned = (
            all_orders_queryset.filter(tenant=tenant)
            .filter(~Q(items__product_owner=tenant))
            .distinct()
            .count()
        )

        # Calculate revenue from different sources
        from django.db.models import Sum

        # Revenue from products owned and sold by tenant
        revenue_owned_products = (
            all_orders_queryset.filter(
                tenant=tenant, items__product_owner=tenant
            ).aggregate(total=Sum("total_amount"))["total"]
            or 0
        )

        # Revenue from reselling other tenants' products
        revenue_resold_products = (
            all_orders_queryset.filter(tenant=tenant)
            .filter(~Q(items__product_owner=tenant))
            .aggregate(total=Sum("total_amount"))["total"]
            or 0
        )

        # Combine all statistics
        statistics = {
            "order_counts": {
                "total_selling_orders": total_selling_orders,
                "total_listing_orders": total_listing_orders,
                "total_product_orders": total_product_orders,
                "status_breakdown": status_counts,
            },
            "product_order_types": {
                "owned_and_sold": owned_and_sold,
                "owned_but_sold_by_others": owned_not_sold,
                "sold_but_owned_by_others": sold_not_owned,
            },
            "revenue": {
                "from_owned_products": float(revenue_owned_products),
                "from_resold_products": float(revenue_resold_products),
                "total": float(revenue_owned_products) + float(revenue_resold_products),
            },
            "date_range": {"start_date": start_date, "end_date": end_date},
        }

        return Response(statistics)

    @swagger_auto_schema(
        operation_summary="Get product order statistics",
        operation_description="Provides statistics about orders for a specific product, including how many were sold by the owner vs. other tenants.",
        manual_parameters=[
            openapi.Parameter(
                "product_id",
                openapi.IN_QUERY,
                description="Product ID to get statistics for",
                type=openapi.TYPE_STRING,
                format=openapi.FORMAT_UUID,
                required=True,
            ),
            openapi.Parameter(
                "start_date",
                openapi.IN_QUERY,
                description="Start date for statistics (YYYY-MM-DD)",
                type=openapi.TYPE_STRING,
                required=False,
            ),
            openapi.Parameter(
                "end_date",
                openapi.IN_QUERY,
                description="End date for statistics (YYYY-MM-DD)",
                type=openapi.TYPE_STRING,
                required=False,
            ),
        ],
        responses={
            200: "Product order statistics",
            400: "Bad request - Missing product_id",
            401: "Unauthorized - Authentication required",
            403: "Forbidden - Not authorized to view this product's statistics",
            404: "Not found - Product not found",
        },
    )
    @action(detail=False, methods=["get"], url_path="product-statistics")
    def product_statistics(self, request):
        """Get statistics about orders for a specific product."""
        product_id = request.query_params.get("product_id")

        if not product_id:
            return Response(
                {"error": "product_id query parameter is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Import Product model
        from products.models import Product

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response(
                {"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND
            )

        # Check if user is authorized to view statistics for this product
        user = request.user
        tenant = user.tenant

        # Only allow access if:
        # 1. User's tenant owns the product, OR
        # 2. User's tenant is selling/listing the product, OR
        # 3. User is a tenant owner/admin
        if (
            product.owner != tenant
            and tenant not in product.tenant.all()
            and not IsTenantMember().has_permission(request, self)
        ):
            return Response(
                {
                    "error": "You don't have permission to view statistics for this product"
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # Filter by date range if provided
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        # Base queryset - all order items for this product
        from django.db.models import Count, Sum

        order_items_queryset = OrderProductItem.objects.filter(product=product)

        # Apply date filters if provided
        if start_date:
            try:
                start_datetime = datetime.datetime.strptime(
                    start_date, "%Y-%m-%d"
                ).replace(tzinfo=timezone.utc)
                order_items_queryset = order_items_queryset.filter(
                    order__created_at__gte=start_datetime
                )
            except ValueError:
                pass

        if end_date:
            try:
                end_datetime = datetime.datetime.strptime(end_date, "%Y-%m-%d").replace(
                    hour=23, minute=59, second=59, tzinfo=timezone.utc
                )
                order_items_queryset = order_items_queryset.filter(
                    order__created_at__lte=end_datetime
                )
            except ValueError:
                pass

        # Total sales stats
        total_quantity_sold = (
            order_items_queryset.aggregate(Sum("quantity"))["quantity__sum"] or 0
        )
        total_sales_count = order_items_queryset.count()

        # Get stats by seller
        sales_by_seller = (
            order_items_queryset.values("order__tenant__name")
            .annotate(
                order_count=Count("order", distinct=True), quantity_sold=Sum("quantity")
            )
            .order_by("-quantity_sold")
        )

        # Get stats by status
        sales_by_status = (
            order_items_queryset.values("order__status")
            .annotate(
                order_count=Count("order", distinct=True), quantity_sold=Sum("quantity")
            )
            .order_by("order__status")
        )

        # Compile statistics
        statistics = {
            "product_info": {
                "id": str(product.id),
                "name": product.name,
                "owner": {"id": str(product.owner.id), "name": product.owner.name},
            },
            "total_sales": {
                "quantity_sold": total_quantity_sold,
                "order_count": total_sales_count,
            },
            "sales_by_seller": [
                {
                    "seller_name": item["order__tenant__name"],
                    "order_count": item["order_count"],
                    "quantity_sold": item["quantity_sold"],
                }
                for item in sales_by_seller
            ],
            "sales_by_status": [
                {
                    "status": item["order__status"],
                    "order_count": item["order_count"],
                    "quantity_sold": item["quantity_sold"],
                }
                for item in sales_by_status
            ],
            "date_range": {"start_date": start_date, "end_date": end_date},
        }

        return Response(statistics)


class RefundRequestViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """List refund requests based on user role."""
        user = request.user
        if user.is_staff or IsTenantMember().has_permission(request, self):
            queryset = RefundRequest.objects.all()
        else:
            queryset = RefundRequest.objects.filter(user=user)

        serializer = RefundRequestSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """Get details of a specific refund request."""
        try:
            refund_request = RefundRequest.objects.get(pk=pk)
            # Check if user has permission to view this request
            if not (
                request.user.is_staff
                or IsTenantMember().has_permission(request, self)
                or refund_request.user == request.user
            ):
                return Response(
                    {"error": "You don't have permission to view this refund request"},
                    status=status.HTTP_403_FORBIDDEN,
                )

            serializer = RefundRequestSerializer(refund_request)
            return Response(serializer.data)
        except RefundRequest.DoesNotExist:
            return Response(
                {"error": "Refund request not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def create(self, request):
        """Create a new refund request."""
        serializer = RefundRequestSerializer(data=request.data)
        if serializer.is_valid():
            order_id = serializer.validated_data.get("order")
            order = Order.objects.get(id=order_id)

            # Check if order is eligible for refund
            if order.status not in ["delivered", "completed"]:
                raise ValidationError(
                    "Only delivered or completed orders can be refunded"
                )

            # Check if refund request already exists
            if RefundRequest.objects.filter(
                order=order, status__in=["pending", "approved"]
            ).exists():
                raise ValidationError("A refund request already exists for this order")

            # Check if payment exists and is completed
            payment = order.payments.filter(status="completed").first()
            if not payment:
                raise ValidationError("No completed payment found for this order")

            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        """Approve a refund request (tenant members only)."""
        if not IsTenantMember().has_permission(request, self):
            return Response(
                {"error": "Only tenant members can approve refund requests"},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            refund_request = RefundRequest.objects.get(pk=pk)

            # Check if refund request is in pending state
            if refund_request.status != "pending":
                return Response(
                    {
                        "error": f"Cannot approve refund request in '{refund_request.status}' status"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Get the payment
            payment = refund_request.order.payments.filter(status="completed").first()
            if not payment:
                return Response(
                    {"error": "No completed payment found for this order"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Update refund request status
            refund_request.status = "approved"
            refund_request.admin_notes = request.data.get("admin_notes", "")
            refund_request.save()

            # Update payment status
            payment.status = "refunded"
            payment.save()

            # Update order status
            refund_request.order.status = "refunded"
            refund_request.order.save()

            serializer = RefundRequestSerializer(refund_request)
            return Response(serializer.data)

        except RefundRequest.DoesNotExist:
            return Response(
                {"error": "Refund request not found"}, status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        """Reject a refund request (tenant members only)."""
        if not IsTenantMember().has_permission(request, self):
            return Response(
                {"error": "Only tenant members can reject refund requests"},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            refund_request = RefundRequest.objects.get(pk=pk)

            # Check if refund request is in pending state
            if refund_request.status != "pending":
                return Response(
                    {
                        "error": f"Cannot reject refund request in '{refund_request.status}' status"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Update refund request status
            refund_request.status = "rejected"
            refund_request.admin_notes = request.data.get("admin_notes", "")
            refund_request.save()

            serializer = RefundRequestSerializer(refund_request)
            return Response(serializer.data)

        except RefundRequest.DoesNotExist:
            return Response(
                {"error": "Refund request not found"}, status=status.HTTP_404_NOT_FOUND
            )


class RefundViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, IsTenantMember]

    def list(self, request):
        """List all refunds (tenant members only)."""
        queryset = Refund.objects.all()
        serializer = RefundSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """Get details of a specific refund."""
        try:
            refund = Refund.objects.get(pk=pk)
            serializer = RefundSerializer(refund)
            return Response(serializer.data)
        except Refund.DoesNotExist:
            return Response(
                {"error": "Refund not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def create(self, request):
        """Process a refund for an approved refund request."""
        serializer = RefundSerializer(data=request.data)
        if serializer.is_valid():
            refund_request = serializer.validated_data["refund_request"]

            # Check if refund request is approved
            if refund_request.status != "approved":
                raise ValidationError(
                    "Can only process refunds for approved refund requests"
                )

            # Get the payment
            payment = refund_request.order.payments.filter(status="refunded").first()
            if not payment:
                raise ValidationError("No refunded payment found for this order")

            try:
                # Here you would integrate with your payment gateway (e.g., Chapa)
                # For example:
                # payment_result = process_refund(refund_request.order, serializer.validated_data['amount'])
                # serializer.save(transaction_id=payment_result.transaction_id, status='completed')

                # For now, we'll just save it
                refund = serializer.save(
                    status="completed",
                    transaction_id=f"REF-{uuid.uuid4().hex[:16].upper()}",
                )

                # Update refund request status
                refund_request.status = "completed"
                refund_request.save()

                return Response(
                    RefundSerializer(refund).data, status=status.HTTP_201_CREATED
                )

            except Exception as e:
                raise ValidationError(f"Failed to process refund: {str(e)}")

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
