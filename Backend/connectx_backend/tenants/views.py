import secrets
from drf_yasg.utils import swagger_auto_schema
from rest_framework import serializers
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from drf_yasg import openapi
from .models import Tenant
from .serializers import TenantSerializer, TenantCreateSerializer
from .permissions import TenantPermission, IsTenantOwner, IsAdmin


# Define a custom serializer for the request body if needed
class TenantCreateRequestSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    fullname = serializers.CharField(max_length=255, required=True)
    # Add any other fields you expect in the request


class TenantViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing tenants.
    """

    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_class(self):
        """
        Return appropriate serializer class based on action.
        """
        if self.action == "create":
            return TenantCreateSerializer
        return TenantSerializer

    def get_queryset(self):
        """
        Filter tenants based on user role:
        - Admin can see all tenants
        - Owner can only see their own tenant
        - Customer can see their tenant and public tenants
        """
        user = self.request.user
        if not user.is_authenticated:
            return Tenant.objects.none()

        if user.is_staff or user.role == "admin":
            return Tenant.objects.all()

        # For owners and customers, only show their own tenant
        return Tenant.objects.filter(id=user.tenant.id)

    def get_permissions(self):
        """
        Instantiate and return the list of permissions that this view requires.
        """
        if self.action == "create":
            permission_classes = []
        elif self.action in ["update", "partial_update"]:
            permission_classes = [IsAuthenticated, IsTenantOwner]
        elif self.action == "destroy":
            permission_classes = [IsAuthenticated, IsTenantOwner | IsAdmin]
        elif self.action == "verification_status":
            permission_classes = [IsAuthenticated, IsAdmin]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    @swagger_auto_schema(request_body=TenantCreateRequestSerializer)
    def create(self, request, *args, **kwargs):
        """Explicitly create a tenant and a user from the request body."""
        data = request.data.copy()

        # Validate tenant data
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        tenant = serializer.save()

        # Import User here to avoid circular import
        from users.models import User

        # Create a user for the tenant with required fields
        User.objects.create(
            name=data.get("fullname", "Tenant Owner"),  # Provide a default name
            email=tenant.email,
            password=data.get("password", ""),  # Password will be hashed in the model
            tenant=tenant,
            role="owner",
        )

        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "name", openapi.IN_FORM, type=openapi.TYPE_STRING, required=False
            ),
            openapi.Parameter(
                "email", openapi.IN_FORM, type=openapi.TYPE_STRING, required=False
            ),
            openapi.Parameter(
                "password", openapi.IN_FORM, type=openapi.TYPE_STRING, required=False
            ),
            openapi.Parameter(
                "fullname", openapi.IN_FORM, type=openapi.TYPE_STRING, required=False
            ),
            openapi.Parameter(
                "logo", openapi.IN_FORM, type=openapi.TYPE_FILE, required=False
            ),
            openapi.Parameter(
                "business_registration_certificate",
                openapi.IN_FORM,
                type=openapi.TYPE_FILE,
                required=False,
            ),
            openapi.Parameter(
                "business_license",
                openapi.IN_FORM,
                type=openapi.TYPE_FILE,
                required=False,
            ),
            openapi.Parameter(
                "tax_registration_certificate",
                openapi.IN_FORM,
                type=openapi.TYPE_FILE,
                required=False,
            ),
            openapi.Parameter(
                "bank_statement",
                openapi.IN_FORM,
                type=openapi.TYPE_FILE,
                required=False,
            ),
            openapi.Parameter(
                "id_card", openapi.IN_FORM, type=openapi.TYPE_FILE, required=False
            ),
            # Add other fields as needed
        ],
        operation_description="Update a tenant using multipart/form-data",
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @action(detail=False, methods=["get"], url_path="me")
    def me(self, request):
        """Return the current user's tenant details."""
        tenant = getattr(request.user, "tenant", None)
        if not tenant:
            return Response({"detail": "No tenant found for user."}, status=404)
        serializer = self.get_serializer(tenant)
        return Response(serializer.data)

    @action(detail=True, methods=["patch"], url_path="verification-status")
    def verification_status(self, request, pk=None):
        """
        Update tenant verification status.
        Only admin users can update verification status.
        """
        tenant = self.get_object()
        is_verified = request.data.get("is_verified")

        # Convert string to boolean if needed
        if isinstance(is_verified, str):
            is_verified = is_verified.lower() == "true"

        if not isinstance(is_verified, bool):
            return Response(
                {"error": "is_verified must be a boolean value"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        tenant.is_verified = is_verified
        tenant.save()
        serializer = self.get_serializer(tenant)
        return Response(serializer.data)
