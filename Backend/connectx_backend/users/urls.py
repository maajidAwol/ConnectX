from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import UserCreate, UserList, UserDetail

urlpatterns = [
    # User management endpoints
    path('user/', UserList.as_view(), name='user_list'),
    path('user/create/', UserCreate.as_view(), name='user_create'),
    path('user/<uuid:pk>/', UserDetail.as_view(), name='user_detail'),
    
    # JWT Authentication endpoints
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]