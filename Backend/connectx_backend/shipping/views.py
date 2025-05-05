from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import ShippingAddress
from .serializers import ShippingAddressSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


class ShippingAddressViewSet(viewsets.ModelViewSet):
    serializer_class = ShippingAddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Ensure users can only access their own shipping addresses."""
        if getattr(self, "swagger_fake_view", False):
            return ShippingAddress.objects.none()
        return ShippingAddress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Automatically associate the address with the authenticated user."""
        serializer.save(user=self.request.user)

    @swagger_auto_schema(
        operation_summary="Get my shipping addresses",
        operation_description="Returns all shipping addresses for the current authenticated user.",
        responses={
            200: openapi.Response(
                description="List of shipping addresses for the current user"
            )
        },
    )
    @action(detail=False, methods=["get"], url_path="my_address")
    def my_address(self, request):
        """Return all shipping addresses for the current authenticated user."""
        addresses = ShippingAddress.objects.filter(user=request.user)
        serializer = self.get_serializer(addresses, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_summary="Find shipping addresses by user ID (tenant owner or admin only)",
        operation_description="""
        Returns all shipping addresses for the specified user ID.\n\nAccessible only by tenant owners or admin users.\n\nQuery parameter: user_id (UUID)
        """,
        manual_parameters=[
            openapi.Parameter(
                "user_id",
                openapi.IN_QUERY,
                description="User UUID to find shipping addresses for",
                type=openapi.TYPE_STRING,
                required=True,
            )
        ],
        responses={
            200: openapi.Response(
                description="List of shipping addresses for the user"
            ),
            400: openapi.Response(description="user_id query parameter is required."),
            403: openapi.Response(description="Permission denied."),
        },
    )
    @action(detail=False, methods=["get"], url_path="by-user")
    def by_user(self, request):
        """Find shipping addresses by user ID (tenant owner or admin only)."""
        user_id = request.query_params.get("user_id")
        if not user_id:
            return Response(
                {"detail": "user_id query parameter is required."}, status=400
            )
        user = request.user
        # Allow only admin or tenant owner
        if not (
            getattr(user, "role", None) in ["admin", "owner"]
            or user.is_staff
            or user.is_superuser
            or user == user_id
        ):
            return Response({"detail": "Permission denied."}, status=403)
        addresses = ShippingAddress.objects.filter(user_id=user_id)
        serializer = self.get_serializer(addresses, many=True)
        return Response(serializer.data)
