from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from .verification import VerifyEmailView, ResendVerificationView
from .views import (
    PasswordResetRequestView,
    PasswordResetView,
    ChangePasswordView,
    UpdateProfileView,
)

# Create a router for UserViewSet
router = DefaultRouter()
router.register(r"users", UserViewSet, basename="user")

urlpatterns = [
    # JWT Authentication Routes
    path("auth/login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # User Profile Update
    path(
        "users/update-profile/", UpdateProfileView.as_view(), name="user-profile-update"
    ),
    # User API Endpoints
    path("", include(router.urls)),
    path("auth/verify-email/", VerifyEmailView.as_view(), name="verify-email"),
    path(
        "auth/resend-verification/",
        ResendVerificationView.as_view(),
        name="resend-verification",
    ),
    path(
        "auth/password-reset-request/",
        PasswordResetRequestView.as_view(),
        name="password-reset-request",
    ),
    path("auth/password-reset/", PasswordResetView.as_view(), name="password-reset"),
    path("auth/change-password/", ChangePasswordView.as_view(), name="change-password"),
]
