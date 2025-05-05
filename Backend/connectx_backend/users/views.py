from rest_framework import viewsets, permissions
from rest_framework_simplejwt.authentication import JWTTokenUserAuthentication
from .models import User
from .serializers import UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.contrib.auth import authenticate
from .models import User
from .serializers import UserSerializer
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework.decorators import action, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
import sys
import os
from pathlib import Path

# Add parent directory to sys.path
sys.path.insert(0, str(Path(__file__).parent.parent))
from utils import upload_image
from rest_framework.decorators import action


class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        """Authenticate user and return JWT token"""
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(request, email=email, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "user": UserSerializer(user).data,
                }
            )
        return Response(
            {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
        )


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        """Allow unauthenticated users to create a new user."""
        print(self.request.headers.get("Authorization"))
        if self.action == "create":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        """Ensure users can only see users in their own tenant."""
        if self.request.user.is_authenticated:
            return User.objects.filter(tenant=self.request.user.tenant)
        return User.objects.none()
    # Simple profile update with file upload
    @action(
        detail=True, 
        methods=['PUT', 'POST'], 
        url_path='update-profile', 
        parser_classes=[MultiPartParser, FormParser, JSONParser]
    )
    def update_profile(self, request, pk=None):
        """
        Update user profile including avatar image upload.
        
        The tenant field cannot be modified through this endpoint.
        """
        user = self.get_object()
        
        # Extract data without copying to avoid pickling errors with file objects
        data = {}
        for key in request.data:
            if key != 'tenant':  # Skip the tenant field
                data[key] = request.data[key]
        
        # Handle avatar image upload if provided
        if 'avatar' in request.FILES:
            avatar_file = request.FILES['avatar']
            
            # Upload the image to Cloudinary
            upload_result = upload_image(
                image_file=avatar_file,
                folder='users',
                public_id=str(user.id)
            )
            
            if upload_result['success']:
                data['avatar_url'] = upload_result['url']
            else:
                return Response(
                    {'error': f"Image upload failed: {upload_result['error']}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Update user fields
        serializer = self.get_serializer(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    @action(detail=False, methods=["get"], url_path="me")
    def me(self, request):
        """Return the current authenticated user's data."""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

