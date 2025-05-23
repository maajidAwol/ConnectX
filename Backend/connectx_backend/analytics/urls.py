from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AnalyticsViewSet, AdminAnalyticsViewSet, TenantAnalyticsViewSet

router = DefaultRouter()
router.register(r"analytics", AnalyticsViewSet)
router.register(r"analytics/admin", AdminAnalyticsViewSet, basename="admin-analytics")
router.register(r'analytics/tenant', TenantAnalyticsViewSet, basename='tenant-analytics')

urlpatterns = [
    path("", include(router.urls)),
]
