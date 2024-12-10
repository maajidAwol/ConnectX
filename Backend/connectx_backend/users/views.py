from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions
from .models import User
from .serializers import UserSerializer




# create user view
class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ['post']

# get user view
class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ['get']

# get user by id view
class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ['get']
