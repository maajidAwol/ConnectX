from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TenantViewSet,VerificationStatusView

router = DefaultRouter()
router.register(r"tenants", TenantViewSet, basename="tenant")

urlpatterns = [
    path("", include(router.urls)),
    path("tenants/<uuid:pk>/VerificationStatus", VerificationStatusView.as_view(), name="tenant-verification-status")
]
