from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from django.db.models import Avg, Count, Q
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Review
from .serializers import ReviewSerializer, ReviewStatsSerializer, ProductReviewSummarySerializer
from products.models import Product
from orders.models import Order
from core.pagination import CustomPagination


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    queryset = Review.objects.all()
    pagination_class = CustomPagination

    def get_permissions(self):
        """Return the list of permissions that apply to an action."""
        if self.action in ["list", "retrieve", "product_reviews", "product_stats", "stats"]:
            permission_classes = [permissions.AllowAny]
        elif self.action in ["create", "update", "partial_update", "destroy"]:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """Filter reviews based on tenant and product."""
        queryset = Review.objects.all()

        if self.action == "list":
            product_id = self.request.query_params.get("product", None)
            if product_id:
                queryset = queryset.filter(product_id=product_id)

        if self.request.user.is_authenticated:
            if self.action in ["update", "partial_update", "destroy"]:
                # Users can only modify their own reviews
                queryset = queryset.filter(user=self.request.user)
            elif self.action == "list":
                # Show all reviews for authenticated users
                return queryset
        else:
            # Unauthenticated users can only see reviews
            if self.action == "list":
                return queryset

        return queryset

    @swagger_auto_schema(
        operation_summary="Create a new review",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['product', 'rating', 'comment'],
            properties={
                'product': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_UUID,
                    description='Product UUID'
                ),
                'rating': openapi.Schema(
                    type=openapi.TYPE_INTEGER,
                    minimum=1,
                    maximum=5,
                    description='Rating from 1 to 5'
                ),
                'comment': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='Review comment'
                ),
            }
        ),
        responses={
            201: ReviewSerializer,
            400: 'Bad Request',
            403: 'Permission Denied - Must purchase product first or already reviewed',
        }
    )
    def create(self, request, *args, **kwargs):
        """Create a new review."""
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        """Create a new review."""
        # Check if the user has purchased the product
        product = serializer.validated_data["product"]
        user = self.request.user
        tenant = user.tenant

        # TODO: Temporarily disabled for demo purposes
        # Check if the user has purchased the product
        # has_purchased = Order.objects.filter(
        #     tenant=tenant, user=user, items__product=product, status="delivered"
        # ).exists()

        # if not has_purchased:
        #     raise PermissionDenied("You must purchase the product before reviewing it.")

        # Check if the user has already reviewed this product
        if Review.objects.filter(tenant=tenant, user=user, product=product).exists():
            raise PermissionDenied("You have already reviewed this product.")

        # Update product review stats
        self._update_product_review_stats(product)
        
        serializer.save(tenant=tenant, user=user, is_purchased=True)

    def perform_update(self, serializer):
        """Update a review."""
        # Only allow users to update their own reviews
        if serializer.instance.user != self.request.user:
            raise PermissionDenied("You can only update your own reviews.")
        
        # Update product review stats after saving
        product = serializer.instance.product
        serializer.save()
        self._update_product_review_stats(product)

    def perform_destroy(self, instance):
        """Delete a review."""
        # Only allow users to delete their own reviews
        if instance.user != self.request.user:
            raise PermissionDenied("You can only delete your own reviews.")
        
        product = instance.product
        instance.delete()
        
        # Update product review stats after deletion
        self._update_product_review_stats(product)

    def _update_product_review_stats(self, product):
        """Update product review statistics"""
        reviews = Review.objects.filter(product=product)
        total_reviews = reviews.count()
        
        if total_reviews > 0:
            avg_rating = reviews.aggregate(avg_rating=Avg('rating'))['avg_rating'] or 0
            product.total_reviews = total_reviews
            product.total_ratings = round(avg_rating, 2)
        else:
            product.total_reviews = 0
            product.total_ratings = 0
            
        product.save(update_fields=['total_reviews', 'total_ratings'])

    @swagger_auto_schema(
        operation_summary="Get current user's reviews",
        operation_description="Retrieve all reviews created by the authenticated user",
        responses={
            200: ReviewSerializer(many=True),
            401: 'Authentication required'
        }
    )
    @action(detail=False, methods=["get"])
    def my_reviews(self, request):
        """Get all reviews by the current user."""
        if not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication required."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        reviews = Review.objects.filter(user=request.user).order_by('-created_at')
        page = self.paginate_queryset(reviews)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_summary="Get reviews for a specific product",
        operation_description="Retrieve all reviews for a specific product with optional pagination",
        manual_parameters=[
            openapi.Parameter(
                'product_id',
                openapi.IN_QUERY,
                description="Product UUID to get reviews for",
                type=openapi.TYPE_STRING,
                format=openapi.FORMAT_UUID,
                required=True
            ),
            openapi.Parameter(
                'page',
                openapi.IN_QUERY,
                description="Page number",
                type=openapi.TYPE_INTEGER,
                required=False
            ),
            openapi.Parameter(
                'page_size',
                openapi.IN_QUERY,
                description="Number of reviews per page",
                type=openapi.TYPE_INTEGER,
                required=False
            )
        ],
        responses={
            200: ReviewSerializer(many=True),
            400: 'Product ID is required'
        }
    )
    @action(detail=False, methods=["get"], url_path="product-reviews")
    def product_reviews(self, request):
        """Get all reviews for a specific product."""
        product_id = request.query_params.get("product_id", None)
        if not product_id:
            return Response(
                {"detail": "Product ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Verify product exists
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response(
                {"detail": "Product not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        reviews = Review.objects.filter(product_id=product_id).order_by('-created_at')
        page = self.paginate_queryset(reviews)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_summary="Get review statistics for a product",
        operation_description="Get comprehensive review statistics including rating distribution for a specific product",
        manual_parameters=[
            openapi.Parameter(
                'product_id',
                openapi.IN_QUERY,
                description="Product UUID to get statistics for",
                type=openapi.TYPE_STRING,
                format=openapi.FORMAT_UUID,
                required=True
            )
        ],
        responses={
            200: ReviewStatsSerializer,
            400: 'Product ID is required',
            404: 'Product not found'
        }
    )
    @action(detail=False, methods=["get"], url_path="product-stats")
    def product_stats(self, request):
        """Get review statistics for a specific product."""
        product_id = request.query_params.get("product_id", None)
        if not product_id:
            return Response(
                {"detail": "Product ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Verify product exists
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response(
                {"detail": "Product not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        reviews = Review.objects.filter(product_id=product_id)
        
        # Calculate statistics
        total_reviews = reviews.count()
        avg_rating = reviews.aggregate(avg_rating=Avg('rating'))['avg_rating'] or 0
        
        # Get rating distribution
        rating_distribution = {}
        for i in range(1, 6):
            count = reviews.filter(rating=i).count()
            rating_distribution[str(i)] = count

        stats_data = {
            "total_reviews": total_reviews,
            "average_rating": round(avg_rating, 2) if avg_rating else 0,
            "rating_distribution": rating_distribution
        }

        serializer = ReviewStatsSerializer(data=stats_data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_summary="Get product reviews with statistics",
        operation_description="Get both reviews and statistics for a product in a single response",
        manual_parameters=[
            openapi.Parameter(
                'product_id',
                openapi.IN_QUERY,
                description="Product UUID",
                type=openapi.TYPE_STRING,
                format=openapi.FORMAT_UUID,
                required=True
            ),
            openapi.Parameter(
                'limit',
                openapi.IN_QUERY,
                description="Number of recent reviews to include (default: 10)",
                type=openapi.TYPE_INTEGER,
                required=False
            )
        ],
        responses={
            200: ProductReviewSummarySerializer,
            400: 'Product ID is required',
            404: 'Product not found'
        }
    )
    @action(detail=False, methods=["get"], url_path="product-summary")
    def product_summary(self, request):
        """Get product reviews with statistics in a single response."""
        product_id = request.query_params.get("product_id", None)
        if not product_id:
            return Response(
                {"detail": "Product ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Verify product exists
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response(
                {"detail": "Product not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        limit = int(request.query_params.get("limit", 10))
        reviews_queryset = Review.objects.filter(product_id=product_id).order_by('-created_at')
        
        # Get recent reviews
        recent_reviews = reviews_queryset[:limit]
        
        # Calculate statistics
        total_reviews = reviews_queryset.count()
        avg_rating = reviews_queryset.aggregate(avg_rating=Avg('rating'))['avg_rating'] or 0
        
        # Get rating distribution
        rating_distribution = {}
        for i in range(1, 6):
            count = reviews_queryset.filter(rating=i).count()
            rating_distribution[str(i)] = count

        # Prepare response data
        reviews_data = ReviewSerializer(recent_reviews, many=True).data
        stats_data = {
            "total_reviews": total_reviews,
            "average_rating": round(avg_rating, 2) if avg_rating else 0,
            "rating_distribution": rating_distribution
        }

        response_data = {
            "reviews": reviews_data,
            "stats": stats_data
        }

        return Response(response_data)

    @swagger_auto_schema(
        operation_summary="Get overall review statistics",
        operation_description="Get overall review statistics across all products (for authenticated users)",
        responses={
            200: ReviewStatsSerializer,
            401: 'Authentication required'
        }
    )
    @action(detail=False, methods=["get"])
    def stats(self, request):
        """Get overall review statistics."""
        if not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication required."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Filter by tenant if user is authenticated
        reviews = Review.objects.filter(tenant=request.user.tenant)
        
        total_reviews = reviews.count()
        avg_rating = reviews.aggregate(avg_rating=Avg('rating'))['avg_rating'] or 0
        
        # Get rating distribution
        rating_distribution = {}
        for i in range(1, 6):
            count = reviews.filter(rating=i).count()
            rating_distribution[str(i)] = count

        stats_data = {
            "total_reviews": total_reviews,
            "average_rating": round(avg_rating, 2) if avg_rating else 0,
            "rating_distribution": rating_distribution
        }

        serializer = ReviewStatsSerializer(data=stats_data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)
