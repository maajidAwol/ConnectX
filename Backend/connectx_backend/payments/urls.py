from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderPaymentViewSet

router = DefaultRouter()
router.register(r"payments", OrderPaymentViewSet, basename="payment")

urlpatterns = [
    path("", include(router.urls)),
]
