from rest_framework import viewsets, permissions,status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import Product
from .serializers import ProductSerializer
from users.permissions import IsTenantOwner
from django.db.models import Q
from rest_framework.exceptions import PermissionDenied
from core.pagination import CustomPagination
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend


from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['name', 'sku', 'description']
    filterset_fields = ['category__name', 'owner', 'is_public']


    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsTenantOwner()]
    @swagger_auto_schema(
    operation_summary="List product under current tenant",
    operation_description="""
    Associates a product with the current user's tenant.
    
    Allowed if:
    - The tenant is the owner of the product
    - OR the product is marked as public
    
    Returns 400 if already listed.
    """,
    request_body=None,
    responses={
        200: openapi.Response(description="Product listed successfully"),
        400: openapi.Response(description="Already listed"),
        403: openapi.Response(description="Permission denied"),
    }
        )
    @action(detail=True, methods=['get'], url_path='list-to-tenant')
    def list_to_tenant(self, request, pk=None):
        """Associate this product with the current user's tenant."""
        product = self.get_object()
        user = request.user
        tenant = user.tenant

        if product.owner != tenant and not product.is_public:
            raise PermissionDenied("You are not allowed to list this product.")

        if tenant in product.tenant.all():
            return Response(
                {"detail": "Product already listed under this tenant."},
                status=status.HTTP_400_BAD_REQUEST
            )

        product.tenant.add(tenant)
        product.save()

        return Response(
            {"detail": f"Product listed under tenant '{tenant.name}'."},
            status=status.HTTP_200_OK
        )

    @swagger_auto_schema(
        operation_summary="Unlist product from current tenant",
        operation_description="""
        Removes the association of this product with the current user's tenant.\n\nAllowed if:\n- The tenant is the owner of the product\n- OR the product is currently listed under the tenant\n\nReturns 400 if not listed.
        """,
        request_body=None,
        responses={
            200: openapi.Response(description="Product unlisted successfully"),
            400: openapi.Response(description="Product not listed under this tenant"),
            403: openapi.Response(description="Permission denied"),
        }
    )
    @action(detail=True, methods=['get'], url_path='unlist-from-tenant')
    def unlist_from_tenant(self, request, pk=None):
        """Remove this product from the current user's tenant."""
        product = self.get_object()
        user = request.user
        tenant = user.tenant

        if product.owner != tenant and tenant not in product.tenant.all():
            raise PermissionDenied("You are not allowed to unlist this product.")

        if tenant not in product.tenant.all():
            return Response(
                {"detail": "Product is not listed under this tenant."},
                status=status.HTTP_400_BAD_REQUEST
            )

        product.tenant.remove(tenant)
        product.save()

        return Response(
            {"detail": f"Product unlisted from tenant '{tenant.name}'."},
            status=status.HTTP_200_OK
        )

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False) or not self.request.user.is_authenticated:
            return Product.objects.none()
        
        tenant = self.request.user.tenant
        filter_type = self.request.query_params.get("filter_type", "public_owned")

        if filter_type == "listed":
            queryset = Product.objects.filter(tenant=tenant)
        elif filter_type == "owned":
            queryset = Product.objects.filter(owner=tenant)
        elif filter_type == "public":
            queryset = Product.objects.filter(is_public=True)
        else:  # "public_owned"
            queryset = Product.objects.filter(Q(owner=tenant) | Q(is_public=True))

        # Optional filters from query params
        tenant_id = self.request.query_params.get("tenant")
        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")
        category = self.request.query_params.get("category")

        if tenant_id:
            queryset = queryset.filter(tenant__id=tenant_id)

        if min_price:
            queryset = queryset.filter(selling_price__gte=min_price)

        if max_price:
            queryset = queryset.filter(selling_price__lte=max_price)

        if category:
            queryset = queryset.filter(category__name__icontains=category)

        return queryset.distinct()
    @swagger_auto_schema(manual_parameters=[
        openapi.Parameter('filter_type', openapi.IN_QUERY, type=openapi.TYPE_STRING,
                          enum=['listed', 'owned', 'public','all'], 
                          description='Filter products by type. Options: "listed", "owned", "public", "all". Defaults to "all".'),
        openapi.Parameter('tenant', openapi.IN_QUERY, description="Tenant UUID to find the listed product by the tenant", type=openapi.TYPE_STRING),
        openapi.Parameter('min_price', openapi.IN_QUERY, description="Min price", type=openapi.TYPE_NUMBER),
        openapi.Parameter('max_price', openapi.IN_QUERY, description="Max price", type=openapi.TYPE_NUMBER),
        openapi.Parameter('category', openapi.IN_QUERY, description="Category name", type=openapi.TYPE_STRING),
        openapi.Parameter('search', openapi.IN_QUERY, type=openapi.TYPE_STRING,description="Search across name, SKU, description, etc."),
        openapi.Parameter('size', openapi.IN_QUERY, description="Page Size", type=openapi.TYPE_NUMBER),


    ])
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def perform_create(self, serializer):
        if not self.request.user.is_authenticated:
            raise PermissionDenied("Authentication is required.")
        serializer.save(owner=self.request.user.tenant)
