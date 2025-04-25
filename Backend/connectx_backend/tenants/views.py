import secrets
from drf_yasg.utils import swagger_auto_schema
from rest_framework import serializers
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Tenant
from .serializers import TenantSerializer


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
    permission_classes = []  # Remove authentication requirement

    @swagger_auto_schema(request_body=TenantCreateRequestSerializer)
    def create(self, request, *args, **kwargs):
        """Explicitly create a tenant and a user from the request body."""
        data = request.data.copy()
        api_key = secrets.token_urlsafe(32)
        data["api_key"] = api_key

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        tenant = serializer.save()

        # Import User here to avoid circular import
        from users.models import User

        # Create a user for the tenant
        User.objects.create(
            name=data.get("fullname"),
            email=tenant.email,
            password=tenant.password,
            tenant=tenant,
            role="merichant",
        )

        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )
