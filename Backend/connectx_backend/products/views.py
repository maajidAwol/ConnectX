from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import Product
from .serializers import ProductSerializer
from users.permissions import IsTenantOwner

from django.db.models import Q
from rest_framework.exceptions import PermissionDenied

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsTenantOwner()]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False) or not self.request.user.is_authenticated:
            return Product.objects.none()

        queryset = Product.objects.filter(
            Q(owner=self.request.user.tenant) | Q(is_public=True)
        )

        # Optional filters from query params
        tenant_id = self.request.query_params.get("tenant")
        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")
        category = self.request.query_params.get("category")

        if tenant_id:
            queryset = queryset.filter(tenants__id=tenant_id)

        if min_price:
            queryset = queryset.filter(selling_price__gte=min_price)

        if max_price:
            queryset = queryset.filter(selling_price__lte=max_price)

        if category:
            queryset = queryset.filter(category__name__icontains=category)

        return queryset.distinct()
    @swagger_auto_schema(manual_parameters=[
        openapi.Parameter('tenant', openapi.IN_QUERY, description="Tenant UUID", type=openapi.TYPE_STRING),
        openapi.Parameter('min_price', openapi.IN_QUERY, description="Min price", type=openapi.TYPE_NUMBER),
        openapi.Parameter('max_price', openapi.IN_QUERY, description="Max price", type=openapi.TYPE_NUMBER),
        openapi.Parameter('category', openapi.IN_QUERY, description="Category name", type=openapi.TYPE_STRING),
    ])
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def perform_create(self, serializer):
        if not self.request.user.is_authenticated:
            raise PermissionDenied("Authentication is required.")
        serializer.save(owner=self.request.user.tenant)
