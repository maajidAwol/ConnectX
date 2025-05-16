from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from .models import Review
from .serializers import ReviewSerializer
from orders.models import Order


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    queryset = Review.objects.all()

    def get_permissions(self):
        """Return the list of permissions that apply to an action."""
        if self.action in ["list", "retrieve"]:
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

    def perform_create(self, serializer):
        """Create a new review."""
        # Check if the user has purchased the product
        product = serializer.validated_data["product"]
        user = self.request.user
        tenant = user.tenant

        # Check if the user has purchased the product
        has_purchased = Order.objects.filter(
            tenant=tenant, user=user, items__product=product, status="delivered"
        ).exists()

        if not has_purchased:
            raise PermissionDenied("You must purchase the product before reviewing it.")

        # Check if the user has already reviewed this product
        if Review.objects.filter(tenant=tenant, user=user, product=product).exists():
            raise PermissionDenied("You have already reviewed this product.")

        serializer.save(tenant=tenant, user=user, is_purchased=True)

    def perform_update(self, serializer):
        """Update a review."""
        # Only allow users to update their own reviews
        if serializer.instance.user != self.request.user:
            raise PermissionDenied("You can only update your own reviews.")
        serializer.save()

    def perform_destroy(self, instance):
        """Delete a review."""
        # Only allow users to delete their own reviews
        if instance.user != self.request.user:
            raise PermissionDenied("You can only delete your own reviews.")
        instance.delete()

    @action(detail=False, methods=["get"])
    def my_reviews(self, request):
        """Get all reviews by the current user."""
        if not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication required."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        reviews = Review.objects.filter(user=request.user)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def product_reviews(self, request):
        """Get all reviews for a specific product."""
        product_id = request.query_params.get("product", None)
        if not product_id:
            return Response(
                {"detail": "Product ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        reviews = Review.objects.filter(product_id=product_id)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)
