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
from .serializers import TenantSerializer
from .permissions import TenantPermission


# Define a custom serializer for the request body if needed
class TenantCreateRequestSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    fullname = serializers.CharField(max_length=255, required=True)
    # Add any other fields you expect in the request


class TenantViewSet(viewsets.ModelViewSet):
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer
    permission_classes = [TenantPermission]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        user = self.request.user
        if self.action in ["list", "retrieve", "destroy", "update", "partial_update"]:
            if user.is_authenticated and user.role == "admin":
                return Tenant.objects.all()
            return Tenant.objects.filter(id=getattr(user, "tenant_id", None))
        return Tenant.objects.none()

    @swagger_auto_schema(request_body=TenantCreateRequestSerializer)
    def create(self, request, *args, **kwargs):
        """Explicitly create a tenant and a user from the request body."""
        data = request.data.copy()

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        tenant = serializer.save()

        # Import User here to avoid circular import
        from users.models import User

        # Create a user for the tenant
        User.objects.create(
            name=data.get("fullname"),
            email=tenant.email,
            password=data.get("password"),
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
