from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentViewSet, chapa_webhook_standalone

router = DefaultRouter()
router.register(r'payments', PaymentViewSet, basename='payment')

urlpatterns = [
    path('', include(router.urls)),
    # Standalone webhook endpoint that bypasses authentication
    path('payments/chapa_webhook_standalone/', chapa_webhook_standalone, name='chapa-webhook-standalone'),
]
