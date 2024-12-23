from django.urls import path
from .views import ProductListCreateView, ProductDetailView

urlpatterns = [

    path('products/', ProductListCreateView.as_view(), name='product-list-create'),
    path('products/<uuid:pk>/', ProductDetailView.as_view(), name='product-detail'),
]
