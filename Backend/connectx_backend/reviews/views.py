from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Review
from .serializers import ReviewSerializer
from .permissions import IsVerifiedBuyer


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Review.objects.none()
        if not self.request.user.is_authenticated:
            return Review.objects.none()
        tenant_id = getattr(self.request.user, "tenant_id", None)
        if tenant_id is None:
            return Review.objects.none()
        return Review.objects.filter(tenant_id=tenant_id)

    def perform_create(self, serializer):
        """Ensure the review belongs to the user's tenant."""
        serializer.save(user=self.request.user, tenant=self.request.user.tenant)

    @action(detail=True, methods=["GET"])
    def product_reviews(self, request, pk=None):
        """Get all reviews for a specific product"""
        reviews = self.get_queryset().filter(product_id=pk)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)
