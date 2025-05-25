from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import Product, ProductListing
from .serializers import ProductSerializer
from users.permissions import IsTenantOwner, IsTenantMember
from rest_framework_simplejwt.authentication import JWTAuthentication

from categories.models import Category
from django.db.models import Q
from rest_framework.exceptions import PermissionDenied
from core.pagination import CustomPagination
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from api_keys.permissions import HasValidAPIKey
from users.models import User
from categories.serializers import CategorySerializer

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ["name", "sku", "description"]
    filterset_fields = ["category__name", "owner", "is_public"]
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        """Allow all authenticated users to read, but only tenant owners can write."""
        if self.action in ["list", "retrieve", "by_category", "listed_categories"]:
            if (
                self.request.user.is_anonymous
                or self.request.user.role == User.CUSTOMER
            ):
                return [HasValidAPIKey()]
            return [permissions.IsAuthenticated()]
        elif self.action in ["create", "update", "partial_update"]:
            return [permissions.IsAuthenticated(), IsTenantMember()]
        elif self.action == "destroy":
            # Only admins can delete products
            return [IsTenantMember()]
        return [permissions.IsAuthenticated()]

    @swagger_auto_schema(
        operation_summary="List product under current tenant",
        operation_description="""   
        Associates a product with the current user's tenant with an optional profit percentage or selling price.
        
        Allowed if:
        - The tenant is the owner of the product
        - OR the product is marked as public
        
        Returns 400 if already listed.
        """,
        manual_parameters=[
            openapi.Parameter(
                "profit_percentage",
                openapi.IN_QUERY,
                description="Profit percentage to apply when listing this product",
                type=openapi.TYPE_NUMBER,
                required=False,
            ),
            openapi.Parameter(
                "selling_price",
                openapi.IN_QUERY,
                description="Selling price to apply when listing this product",
                type=openapi.TYPE_NUMBER,
                required=False,
            ),
        ],
        responses={
            200: openapi.Response(description="Product listed successfully"),
            400: openapi.Response(description="Already listed"),
            403: openapi.Response(description="Permission denied"),
        },
    )
    @action(detail=True, methods=["get"], url_path="list-to-tenant")
    def list_to_tenant(self, request, pk=None):
        """Associate this product with the current user's tenant."""
        product = self.get_object()
        user = request.user
        tenant = user.tenant

        if product.owner != tenant and not product.is_public:
            raise PermissionDenied("You are not allowed to list this product.")

        if ProductListing.objects.filter(product=product, tenant=tenant).exists():
            return Response(
                {"detail": "Product already listed under this tenant."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        profit_percentage = request.query_params.get("profit_percentage")
        selling_price = request.query_params.get("selling_price")

        kwargs = {"product": product, "tenant": tenant}
        if profit_percentage is not None:
            kwargs["profit_percentage"] = float(profit_percentage)
        if selling_price is not None:
            kwargs["selling_price"] = float(selling_price)

        ProductListing.objects.create(**kwargs)

        return Response(
            {"detail": f"Product listed under tenant '{tenant.name}'."},
            status=status.HTTP_200_OK,
        )

    @swagger_auto_schema(
        operation_summary="Unlist product from current tenant",
        operation_description="""
        Removes the association of this product with the current user's tenant.

        Allowed if:
        - The tenant is the owner of the product
        - OR the product is currently listed under the tenant

        Returns 400 if not listed.
        """,
        request_body=None,
        responses={
            200: openapi.Response(description="Product unlisted successfully"),
            400: openapi.Response(description="Product not listed under this tenant"),
            403: openapi.Response(description="Permission denied"),
        },
    )
    @action(detail=True, methods=["get"], url_path="unlist-from-tenant")
    def unlist_from_tenant(self, request, pk=None):
        """Remove this product from the current user's tenant."""
        product = self.get_object()
        tenant = request.user.tenant

        listing = ProductListing.objects.filter(product=product, tenant=tenant).first()

        if not listing and product.owner != tenant:
            raise PermissionDenied("You are not allowed to unlist this product.")

        if not listing:
            return Response(
                {"detail": "Product is not listed under this tenant."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        listing.delete()

        return Response(
            {"detail": f"Product unlisted from tenant '{tenant.name}'."},
            status=status.HTTP_200_OK,
        )

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Product.objects.none()

        tenant = getattr(self.request, "tenant", None)
        user = self.request.user

        # No tenant -> return nothing (invalid API key or bad setup)
        if tenant is None and not user.is_authenticated:
            return Product.objects.none()

        filter_type = self.request.query_params.get("filter_type", "public_owned")

        if user.is_authenticated:
            # Authenticated access (JWT)
            tenant = self.request.user.tenant
            if self.action in ["update", "partial_update", "destroy"]:
                queryset = Product.objects.filter(owner=tenant)
            else:
                queryset = Product.objects.filter(Q(owner=tenant) | Q(is_public=True))
        else:
            # Unauthenticated (API key access)
            # Only show products that are listed under the tenant
            print("tenant", tenant)
            listings = ProductListing.objects.filter(tenant=tenant)
            product_ids = listings.values_list("product_id", flat=True)
            queryset = Product.objects.filter(id__in=product_ids)

        # Filter by filter_type
        if filter_type == "listed":
            listings = ProductListing.objects.filter(tenant=tenant)
            product_ids = listings.values_list("product_id", flat=True)
            queryset = queryset.filter(id__in=product_ids)
        elif filter_type == "owned":
            queryset = queryset.filter(owner=tenant)
        elif filter_type == "public":
            queryset = queryset.filter(is_public=True)

        # Filter by price and category
        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")
        category = self.request.query_params.get("category")

        if min_price:
            queryset = queryset.filter(base_price__gte=min_price)
        if max_price:
            queryset = queryset.filter(base_price__lte=max_price)
        if category:
            queryset = queryset.filter(category__name__icontains=category)

        return queryset.distinct()

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "filter_type",
                openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                enum=["listed", "owned", "public", "public_owned"],
                description='Filter products by type. Defaults to "public_owned".',
            ),
            openapi.Parameter("min_price", openapi.IN_QUERY, type=openapi.TYPE_NUMBER),
            openapi.Parameter("max_price", openapi.IN_QUERY, type=openapi.TYPE_NUMBER),
            openapi.Parameter("category", openapi.IN_QUERY, type=openapi.TYPE_STRING),
            openapi.Parameter("search", openapi.IN_QUERY, type=openapi.TYPE_STRING),
            openapi.Parameter("size", openapi.IN_QUERY, type=openapi.TYPE_NUMBER),
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Create a new product",
        request_body=ProductSerializer,
        responses={
            201: openapi.Response(
                description="Product created successfully", schema=ProductSerializer
            ),
            400: openapi.Response(description="Bad Request"),
            401: openapi.Response(description="Unauthorized"),
            403: openapi.Response(description="Permission Denied"),
        },
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Update an existing product",
        request_body=ProductSerializer,
        responses={
            200: openapi.Response(
                description="Product updated successfully", schema=ProductSerializer
            ),
            400: openapi.Response(description="Bad Request"),
            401: openapi.Response(description="Unauthorized"),
            403: openapi.Response(description="Permission Denied"),
            404: openapi.Response(description="Not Found"),
        },
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Partially update an existing product",
        request_body=ProductSerializer,
        responses={
            200: openapi.Response(
                description="Product partially updated successfully",
                schema=ProductSerializer,
            ),
            400: openapi.Response(description="Bad Request"),
            401: openapi.Response(description="Unauthorized"),
            403: openapi.Response(description="Permission Denied"),
            404: openapi.Response(description="Not Found"),
        },
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Get products filtered by category ID",
        operation_summary="List products by category",
        manual_parameters=[
            openapi.Parameter(
                "category_id",
                openapi.IN_PATH,
                description="Category ID (UUID)",
                type=openapi.TYPE_STRING,
                format=openapi.FORMAT_UUID,
                required=True,
            ),
        ],
        responses={
            200: openapi.Response(
                description="Success", schema=ProductSerializer(many=True)
            ),
            404: "Category not found",
            500: "Server error",
        },
    )
    @action(
        detail=False, methods=["GET"], url_path="by-category/(?P<category_id>[^/.]+)"
    )
    def by_category(self, request, category_id=None):
        """Get products filtered by category ID."""
        category = get_object_or_404(Category, id=category_id)
        products = self.get_queryset().filter(category=category)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
    @swagger_auto_schema(
        operation_description="Get categories of listed products",
        operation_summary="List categories of listed products",
        responses={
            200: openapi.Response(
                description="Success", schema=CategorySerializer(many=True)
            ),
            404: "No categories found",
            500: "Server error",
        },
    )
    @action(
        detail=False, methods=["GET"], url_path="listed-categories"
    )
    def listed_categories(self, request):
        """Get categories of listed products without duplicates."""
        categories = Category.objects.filter(products__in=self.get_queryset()).distinct()
        page = self.paginate_queryset(categories)
        if page is not None:
            serializer = CategorySerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        """Set the owner to the current user's tenant."""
        serializer.save(owner=self.request.user.tenant)

    def perform_update(self, serializer):
        """Ensure only the owner can update the product."""
        instance = self.get_object()
        if instance.owner != self.request.user.tenant:
            raise PermissionDenied("You can only update products you own.")
        serializer.save()
