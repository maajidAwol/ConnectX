from django.urls import path
from .views import TransactionListCreateView, TransactionDetailView

urlpatterns = [
    path('transactions/', TransactionListCreateView.as_view(), name='transaction-list-create'),
    path('transactions/<uuid:pk>/', TransactionDetailView.as_view(), name='transaction-detail'),
]