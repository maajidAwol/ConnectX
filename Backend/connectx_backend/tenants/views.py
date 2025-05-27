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
from django.utils import timezone
from django.urls import path
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from django_filters import rest_framework as filters
from rest_framework.filters import SearchFilter, OrderingFilter

from users.utils.email_utils import send_verification_email


# Define a custom serializer for the request body if needed
class TenantCreateRequestSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    fullname = serializers.CharField(max_length=255, required=True)
    age = serializers.IntegerField(required=True)
    gender = serializers.ChoiceField(choices=['male', 'female'], required=True)
    # Add any other fields you expect in the request


class VerificationStatusView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    @swagger_auto_schema(
        operation_summary="Update tenant verification status",
        operation_description="Update the verification status of a tenant. Only admin users can perform this action.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "is_verified": openapi.Schema(
                    type=openapi.TYPE_BOOLEAN,
                    description="Whether the tenant is verified.",
                ),
                "reason": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Reason for the verification status update.",
                ),
            },
            required=["is_verified"],  # Define required fields here
        ),
        responses={
            200: openapi.Response(
                description="Verification status updated successfully."
            ),
            400: openapi.Response(description="Invalid input."),
            403: openapi.Response(description="Permission denied."),
        },
    )
    def patch(self, request, pk=None):
        """
        Update tenant verification status.
        Only admin users can update verification status.
        """
        tenant = get_object_or_404(Tenant, pk=pk)
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
        tenant.tenant_verification_status = "approved" if is_verified else "rejected"
        tenant.tenant_verification_date = timezone.now().date()
        tenant.save()
        serializer = TenantSerializer(tenant)
        return Response(serializer.data)


class TenantFilter(filters.FilterSet):
    is_verified = filters.BooleanFilter()
    is_active = filters.BooleanFilter()
    tenant_verification_status = filters.CharFilter()
    created_at = filters.DateFilter()
    updated_at = filters.DateFilter()
    business_type = filters.CharFilter()

    class Meta:
        model = Tenant
        fields = [
            "is_verified",
            "is_active",
            "tenant_verification_status",
            "created_at",
            "updated_at",
            "business_type",
        ]


class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


class TenantViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing tenants.
    """

    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    pagination_class = CustomPagination
    filter_backends = [filters.DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = TenantFilter
    search_fields = [
        "name",
        "email",
        "legal_name",
        "business_registration_number",
        "business_type",
        "business_bio",
    ]
    ordering_fields = ["created_at", "updated_at", "name"]
    ordering = ["-created_at"]  # Default ordering

    @swagger_auto_schema(
        operation_summary="List all tenants",
        operation_description="Get a list of all tenants with filtering, searching, and pagination options",
        manual_parameters=[
            openapi.Parameter(
                "is_verified",
                openapi.IN_QUERY,
                description="Filter by verification status",
                type=openapi.TYPE_BOOLEAN,
                required=False,
            ),
            openapi.Parameter(
                "is_active",
                openapi.IN_QUERY,
                description="Filter by active status",
                type=openapi.TYPE_BOOLEAN,
                required=False,
            ),
            openapi.Parameter(
                "tenant_verification_status",
                openapi.IN_QUERY,
                description="Filter by verification status",
                type=openapi.TYPE_STRING,
                required=False,
                enum=["unverified", "pending", "under_review", "approved", "rejected"],
            ),
            openapi.Parameter(
                "created_at",
                openapi.IN_QUERY,
                description="Filter by creation date (YYYY-MM-DD)",
                type=openapi.TYPE_STRING,
                format=openapi.FORMAT_DATE,
                required=False,
            ),
            openapi.Parameter(
                "updated_at",
                openapi.IN_QUERY,
                description="Filter by last update date (YYYY-MM-DD)",
                type=openapi.TYPE_STRING,
                format=openapi.FORMAT_DATE,
                required=False,
            ),
            openapi.Parameter(
                "business_type",
                openapi.IN_QUERY,
                description="Filter by business type",
                type=openapi.TYPE_STRING,
                required=False,
            ),
            openapi.Parameter(
                "search",
                openapi.IN_QUERY,
                description="Search in name, email, legal_name, business_registration_number, business_type, business_bio",
                type=openapi.TYPE_STRING,
                required=False,
            ),
            openapi.Parameter(
                "ordering",
                openapi.IN_QUERY,
                description="Order by field (prefix with '-' for descending order). Available fields: created_at, updated_at, name",
                type=openapi.TYPE_STRING,
                required=False,
                enum=["created_at", "updated_at", "name", "-created_at", "-updated_at", "-name"],
            ),
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
                description="Number of items per page (max: 100)",
                type=openapi.TYPE_INTEGER,
                required=False,
            ),
        ],
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_serializer_class(self):
        """
        Return appropriate serializer class based on action.
        """
        if self.action == "create":
            return TenantCreateSerializer
        return TenantSerializer

    def get_queryset(self):
        """
        Filter tenants based on user role and apply search/filtering:
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
            permission_classes = [IsAuthenticated, IsTenantOwner | IsAdmin]
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
        tenant_owner = User.objects.create(
            name=data.get("fullname", "Tenant Owner"),  # Provide a default name
            email=tenant.email,
            password=data.get("password", ""),  # Password will be hashed in the model
            tenant=tenant,
            role="owner",
            age=data.get("age", None),  # Optional field
            gender=data.get("gender", "none"),
        )
        # send verification email
        send_verification_email(tenant_owner)

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

    @swagger_auto_schema(
        operation_summary="List tenants under review",
        operation_description="List all tenants with a verification status of 'under_reviw'. Only admin users can access this endpoint.",
        responses={
            200: openapi.Response(description="List of tenants under review."),
            403: openapi.Response(description="Permission denied."),
        },
        manual_parameters=[],  # <-- Remove filters from Swagger for this action
    )
    @action(detail=False, methods=["get"], url_path="pending-verifications")
    def pending_verifications(self, request):
        """
        List all tenants with a verification status of 'under_reviw'.
        Only admin users can access this endpoint.
        """
        if not request.user.is_staff and request.user.role != "admin":
            return Response(
                {"detail": "You do not have permission to perform this action."},
                status=status.HTTP_403_FORBIDDEN,
            )
        pending_tenants = Tenant.objects.filter(tenant_verification_status="pending")
        paginator = CustomPagination()
        paginated_tenants = paginator.paginate_queryset(pending_tenants, request)
        serializer = self.get_serializer(paginated_tenants, many=True)
        return paginator.get_paginated_response(serializer.data)
