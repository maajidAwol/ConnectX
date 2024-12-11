from django.urls import path
from .views import (
    StockRequestList,
    StockRequestCreate,
    StockRequestRetrieve,
    StockRequestUpdate,
    StockRequestDelete,
    ApproveStockRequest,
    RejectStockRequest,
)

urlpatterns = [
    path('stock-requests/', StockRequestList.as_view(), name='stockrequest-list'),
    path('stock-requests/', StockRequestCreate.as_view(), name='stockrequest-create'),
    path('stock-requests/<uuid:pk>/', StockRequestRetrieve.as_view(), name='stockrequest-retrieve'),
    path('stock-requests/<uuid:pk>/', StockRequestUpdate.as_view(), name='stockrequest-update'),
    path('stock-requests/<uuid:pk>/', StockRequestDelete.as_view(), name='stockrequest-delete'),
    path('stock-requests/<uuid:pk>/approve/', ApproveStockRequest.as_view(), name='stockrequest-approve'),
    path('stock-requests/<uuid:pk>/reject/', RejectStockRequest.as_view(), name='stockrequest-reject'),
]
