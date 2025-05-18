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
from utils import upload_image
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from .serializers import PasswordResetRequestSerializer, PasswordResetSerializer
from .utils.email_utils import send_password_reset_email
from .utils.jwt_utils import decode_password_reset_token
from django.utils.translation import gettext_lazy as _
from rest_framework.permissions import AllowAny
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        """Authenticate user and return JWT token"""
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(request, email=email, password=password)

        if user:
            if not user.is_verified:
                return Response(
                    {
                        "error": "Please verify your email address before logging in. Check your email for the verification link.",
                        "email": user.email,
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

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
    ordering = ["-created_at", "name"]

    def get_permissions(self):
        """Allow unauthenticated users to create a new user."""
        print(self.request.headers.get("Authorization"))
        if self.action == "create":
            return [permissions.AllowAny()]
        if self.action == "destroy":
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        """Ensure users can only see users in their own tenant, except for admins who can see all users."""
        if not self.request.user.is_authenticated:
            return User.objects.none()
        if self.request.user.is_staff or self.request.user.role == User.ADMIN:
            return User.objects.all()
        elif self.request.user.role == User.OWNER:
            return User.objects.filter(tenant=self.request.user.tenant)
        else :
            # Customers can only see their own tenant
            return User.objects.filter(id=self.request.user.id)
        
    # Simple profile update with file upload
    @action(
        detail=True,
        methods=["PUT", "POST"],
        url_path="update-profile",
        parser_classes=[MultiPartParser, FormParser, JSONParser],
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
            if key != "tenant":  # Skip the tenant field
                data[key] = request.data[key]

        # Handle avatar image upload if provided
        if "avatar" in request.FILES:
            avatar_file = request.FILES["avatar"]

            # Upload the image to Cloudinary
            upload_result = upload_image(
                image_file=avatar_file, folder="users", public_id=str(user.id)
            )

            if upload_result["success"]:
                data["avatar_url"] = upload_result["url"]
            else:
                return Response(
                    {"error": f"Image upload failed: {upload_result['error']}"},
                    status=status.HTTP_400_BAD_REQUEST,
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


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        request_body=PasswordResetRequestSerializer,
        responses={
            200: openapi.Response(description="Password reset email sent"),
            404: openapi.Response(description="User not found"),
            500: openapi.Response(description="Failed to send email"),
            400: openapi.Response(description="Invalid input"),
        },
    )
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response(
                    {"error": _("User not found")},
                    status=status.HTTP_404_NOT_FOUND,
                )
            if send_password_reset_email(user):
                return Response(
                    {"message": _("Password reset email sent")},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"error": _("Failed to send email")},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        request_body=PasswordResetSerializer,
        responses={
            200: openapi.Response(description="Password has been reset successfully"),
            400: openapi.Response(
                description="Invalid or expired token or invalid input"
            ),
            404: openapi.Response(description="User not found"),
        },
    )
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data["token"]
            new_password = serializer.validated_data["new_password"]
            payload = decode_password_reset_token(token)
            if not payload:
                return Response(
                    {"error": _("Invalid or expired token")},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            try:
                user = User.objects.get(id=payload["user_id"], email=payload["email"])
            except User.DoesNotExist:
                return Response(
                    {"error": _("User not found")},
                    status=status.HTTP_404_NOT_FOUND,
                )
            user.set_password(new_password)
            user.save()
            return Response(
                {"message": _("Password has been reset successfully")},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
