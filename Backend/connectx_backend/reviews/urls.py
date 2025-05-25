from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReviewViewSet

router = DefaultRouter()
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

# Available endpoints:
# - POST /reviews/ - Create a new review
# - GET /reviews/ - List all reviews (with optional ?product_id filter)
# - GET /reviews/{id}/ - Get specific review
# - PUT /reviews/{id}/ - Update specific review (own reviews only)
# - DELETE /reviews/{id}/ - Delete specific review (own reviews only)
# - GET /reviews/my_reviews/ - Get current user's reviews
# - GET /reviews/product-reviews/?product_id={uuid} - Get reviews for specific product
# - GET /reviews/product-stats/?product_id={uuid} - Get review statistics for specific product
# - GET /reviews/product-summary/?product_id={uuid}&limit={int} - Get reviews + stats for product
# - GET /reviews/stats/ - Get overall review statistics (authenticated users)
