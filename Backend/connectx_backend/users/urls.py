from django.urls import path
from . import views

urlpatterns = [
    path('user/', views.UserList.as_view(), name='user_create'),
    path('user/create/', views.UserCreate.as_view(), name='user_create'),
    path('user/<int:pk>/', views.UserDetail.as_view(), name='user_detail'),    
]

