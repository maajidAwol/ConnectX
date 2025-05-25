from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    OrderViewSet,
    RefundRequestViewSet,
    RefundViewSet,
)

router = DefaultRouter()
router.register(r"orders", OrderViewSet, basename="order")
router.register(r"refund-requests", RefundRequestViewSet, basename="refund-request")
router.register(r"refunds", RefundViewSet, basename="refund")

# Add custom URL patterns for refund actions
refund_request_urlpatterns = [
    path(
        "refund-requests/<uuid:pk>/approve/",
        RefundRequestViewSet.as_view({"post": "approve"}),
        name="refund-request-approve",
    ),
    path(
        "refund-requests/<uuid:pk>/reject/",
        RefundRequestViewSet.as_view({"post": "reject"}),
        name="refund-request-reject",
    ),
]

urlpatterns = [
    path("", include(router.urls)),
    path("", include(refund_request_urlpatterns)),
]
