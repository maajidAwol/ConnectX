from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderShippingAddressViewSet

router = DefaultRouter()
router.register(r"shipping-addresses", OrderShippingAddressViewSet, basename="shipping-address")

urlpatterns = [
    path("", include(router.urls)),
]
