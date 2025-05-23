from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AnalyticsViewSet,
    AdminAnalyticsViewSet,
    TenantAnalyticsViewSet,
    APIUsageLogViewSet,
)

router = DefaultRouter()
router.register(r"analytics", AnalyticsViewSet, basename="analytics")
router.register(r"admin/analytics", AdminAnalyticsViewSet, basename="admin-analytics")
router.register(r"tenant", TenantAnalyticsViewSet, basename="tenant-analytics")
router.register(r"api-logs", APIUsageLogViewSet, basename="api-logs")

urlpatterns = [
    path("", include(router.urls)),
]
