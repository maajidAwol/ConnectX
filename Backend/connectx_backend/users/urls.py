from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

# Create a router for UserViewSet
router = DefaultRouter()
router.register(r"users", UserViewSet, basename="user")

urlpatterns = [
    # JWT Authentication Routes
    path("auth/login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    
    # User Profile Update
    path("users/<uuid:pk>/update-profile/", UserViewSet.as_view({"put": "update_profile", "post": "update_profile"}), name="user-profile-update"),
    
    # User API Endpoints
    path("", include(router.urls)),
]
