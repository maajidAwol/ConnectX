from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import ApiKey
from .serializers import ApiKeySerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from users.permissions import IsTenantOwner

class ApiKeyViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'delete']  
    serializer_class = ApiKeySerializer
    permission_classes = [IsAuthenticated, IsTenantOwner]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return ApiKey.objects.none()
        if self.action == "retrieve" or self.action == "destroy":
            if self.request.user.role == "owner":
                return ApiKey.objects.filter(
                    tenant=self.request.user.tenant, id=self.kwargs["pk"]
                )
            if self.request.user.role == "admin":
                return ApiKey.objects.filter(
                    id=self.kwargs["pk"]
                )
        
        if self.request.user.role == "admin":
            return ApiKey.objects.all()
        return ApiKey.objects.filter(tenant=self.request.user.tenant)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["is_create"] = self.action == "create"
        return context

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant)
    @action(detail=True, methods=["post"], url_path="revoke")
    def revoke(self, request, pk=None):
        api_key = self.get_object()

        if not api_key.is_active:
            return Response(
                {"detail": "API key is already revoked."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        api_key.is_active = False
        api_key.revoked_at = timezone.now()
        api_key.save()

        return Response(
            {"detail": "API key revoked successfully."}, status=status.HTTP_200_OK
        )
