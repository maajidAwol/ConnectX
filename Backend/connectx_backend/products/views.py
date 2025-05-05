from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import Product
from .serializers import ProductSerializer
from users.permissions import IsTenantOwner
from categories.models import Category
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    def get_permissions(self):
        """Allow all authenticated users to read, but only tenant owners can write."""
        if self.action in ['list', 'retrieve', 'by_category']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsTenantOwner()]
    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Product.objects.none()
        if not self.request.user.is_authenticated:
            return Product.objects.none()
        return Product.objects.filter(tenant=self.request.user.tenant)

    def perform_create(self, serializer):
        if not self.request.user.is_authenticated:
            raise PermissionDenied("Authentication is required.")
        serializer.save(owner=self.request.user)
        
    @swagger_auto_schema(
        operation_description="Get products filtered by category ID",
        operation_summary="List products by category",
        manual_parameters=[
            openapi.Parameter(
                'category_id',
                openapi.IN_PATH,
                description="Category ID (UUID)",
                type=openapi.TYPE_STRING,
                format=openapi.FORMAT_UUID,
                required=True
            ),
        ],
        responses={
            200: openapi.Response(
                description="Success",
                schema=ProductSerializer(many=True)
            ),
            404: "Category not found",
            500: "Server error"
        }
    )
    @action(detail=False, methods=['GET'], url_path='by-category/(?P<category_id>[^/.]+)')
    def by_category(self, request, category_id=None):
        """
        Get products filtered by category ID.
        """
        try:
            # Verify the category exists
            category = get_object_or_404(Category, id=category_id)
            
            # Get the base queryset and filter by category
            queryset = self.get_queryset().filter(category=category)
            
            # Return all results
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=500
            )
