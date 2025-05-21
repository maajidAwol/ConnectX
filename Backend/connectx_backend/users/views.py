from rest_framework import viewsets, permissions
from rest_framework_simplejwt.authentication import JWTTokenUserAuthentication

from tenants.permissions import IsTenantOwner
from .models import User
from .serializers import UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
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
from .serializers import (
    PasswordResetRequestSerializer,
    PasswordResetSerializer,
    ChangePasswordSerializer,
)
from .utils.email_utils import send_password_reset_email
from .utils.jwt_utils import decode_password_reset_token
from django.utils.translation import gettext_lazy as _
from rest_framework.permissions import AllowAny
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from core.pagination import CustomPagination


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
    pagination_class = CustomPagination

    def get_permissions(self):
        """Allow unauthenticated users to create a new user."""
        if self.action == "create":
            # Allow any user (authenticated or unauthenticated) to hit the create endpoint.
            # The actual permission/role check happens within the create method.
            return [permissions.AllowAny()]
        if self.action == "destroy":
            return [permissions.IsAdminUser()| IsTenantOwner]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        """Ensure users can only see users in their own tenant, except for admins who can see all users."""
        if not self.request.user.is_authenticated:
            return User.objects.none()
        if self.request.user.is_staff or self.request.user.role == User.ADMIN:
            return User.objects.all()
        elif self.request.user.role in [User.OWNER, User.MEMBER]:
            # Both owners and members can see all users in their tenant
            return User.objects.filter(tenant=self.request.user.tenant)
        else:
            # Customers can only see their own profile
            return User.objects.filter(id=self.request.user.id)

    def create(self, request, *args, **kwargs):
        # Check if the request is authenticated
        if request.user.is_authenticated:
            # Authenticated user is creating a new user
            creator_role = request.user.role
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            validated_data = serializer.validated_data

            if creator_role == User.OWNER:
                # Owner creating a member for their tenant
                validated_data["role"] = User.MEMBER
                validated_data["tenant"] = request.user.tenant
            elif creator_role == User.ADMIN:
                # Admin creating a user, can specify role (including other admins)
                if "role" in validated_data and validated_data["role"] not in [
                    User.ADMIN,
                    User.OWNER,
                    User.CUSTOMER,
                    User.MEMBER,
                ]:
                    return Response(
                        {
                            "error": "Admin can only create users with roles: admin, owner, customer, or member."
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                elif "role" not in validated_data:
                    return Response(
                        {
                            "error": "Role must be specified when an admin creates a user."
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                # Tenant assignment for admin created users
                if (
                    "tenant" not in validated_data
                    and validated_data["role"] == User.ADMIN
                ):
                    validated_data["tenant"] = None  # Global admin
                elif (
                    "tenant" not in validated_data
                    and validated_data["role"] != User.ADMIN
                ):
                    return Response(
                        {
                            "error": "Tenant must be specified when creating a non-admin user as an admin."
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            else:
                # Customers are not allowed to create users
                return Response(
                    {"error": "You do not have permission to create users."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            user = serializer.save()
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data, status=status.HTTP_201_CREATED, headers=headers
            )

        else:
            # Anonymous user is creating a new user
            # Assuming a middleware or similar process validates the API key and sets request.tenant
            if hasattr(request, "tenant") and request.tenant is not None:
                # Valid API key found and tenant is set
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                validated_data = serializer.validated_data

                # Anonymous user with API key creates a customer for the tenant
                validated_data["role"] = User.CUSTOMER
                validated_data["tenant"] = request.tenant

                user = serializer.save()
                headers = self.get_success_headers(serializer.data)
                return Response(
                    serializer.data, status=status.HTTP_201_CREATED, headers=headers
                )
            else:
                # No valid API key or tenant not set, disallow creation
                return Response(
                    {"error": "API key required to create a user anonymously."},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

    def destroy(self, request, *args, **kwargs):
        """Only admins and owners can delete users."""
        if not request.user.is_authenticated:
            return Response(
                {"error": "Authentication required."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if request.user.role not in [User.ADMIN, User.OWNER]:
            return Response(
                {"error": "Only admins and owners can delete users."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # If user is an owner, they can only delete users from their tenant
        if request.user.role == User.OWNER:
            instance = self.get_object()
            if instance.tenant != request.user.tenant:
                return Response(
                    {"error": "You can only delete users from your own tenant."},
                    status=status.HTTP_403_FORBIDDEN,
                )

        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=["get"], url_path="me")
    def me(self, request):
        """Return the current authenticated user's data."""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_summary="List all members for the current tenant",
        operation_description="""
        List all members associated with the current tenant.
        Only accessible by admins and tenant owners.
        
        Query Parameters:
        - page: Page number (default: 1)
        - size: Number of items per page (default: 10)
        """,
        manual_parameters=[
            openapi.Parameter(
                "page",
                openapi.IN_QUERY,
                description="Page number",
                type=openapi.TYPE_INTEGER,
                required=False,
            ),
            openapi.Parameter(
                "size",
                openapi.IN_QUERY,
                description="Number of items per page",
                type=openapi.TYPE_INTEGER,
                required=False,
            ),
        ],
        responses={
            200: openapi.Response(
                description="List of members", schema=UserSerializer(many=True)
            ),
            403: openapi.Response(description="Permission denied"),
        },
    )
    @action(detail=False, methods=["get"], url_path="members")
    def members(self, request):
        """List all members for the current tenant."""
        if not request.user.is_authenticated:
            return Response(
                {"error": "Authentication required."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if request.user.role not in [User.ADMIN, User.OWNER, User.MEMBER]:
            return Response(
                {"error": "Only admins , members and owners can view members."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # If admin, they can see all members across all tenants
        if request.user.role == User.ADMIN:
            members = User.objects.filter(role=User.MEMBER)
        else:
            # If owner, they can only see members in their tenant
            members = User.objects.filter(role=User.MEMBER, tenant=request.user.tenant)

        # Apply pagination
        page = self.paginate_queryset(members)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(members, many=True)
        return Response(serializer.data)


class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "name",
                openapi.IN_FORM,
                description="Full name",
                type=openapi.TYPE_STRING,
            ),
            openapi.Parameter(
                "bio",
                openapi.IN_FORM,
                description="Bio",
                type=openapi.TYPE_STRING,
            ),
            openapi.Parameter(
                "phone_number",
                openapi.IN_FORM,
                description="Phone number",
                type=openapi.TYPE_STRING,
            ),
            openapi.Parameter(
                "avatar",
                openapi.IN_FORM,
                description="Avatar image",
                type=openapi.TYPE_FILE,
            ),
        ],
        responses={200: UserSerializer},
    )
    def put(self, request):
        return self._update_profile(request)

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "name",
                openapi.IN_FORM,
                description="Full name",
                type=openapi.TYPE_STRING,
            ),
            openapi.Parameter(
                "bio",
                openapi.IN_FORM,
                description="Bio",
                type=openapi.TYPE_STRING,
            ),
            openapi.Parameter(
                "phone_number",
                openapi.IN_FORM,
                description="Phone number",
                type=openapi.TYPE_STRING,
            ),
            openapi.Parameter(
                "avatar",
                openapi.IN_FORM,
                description="Avatar image",
                type=openapi.TYPE_FILE,
            ),
        ],
        responses={200: UserSerializer},
    )
    def post(self, request):
        return self._update_profile(request)

    def _update_profile(self, request):
        user = request.user
        data = request.data.copy()
        # Handle avatar image upload if provided
        if "avatar" in request.FILES:
            avatar_file = request.FILES["avatar"]
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
        serializer = UserSerializer(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        request_body=ChangePasswordSerializer,
        responses={
            200: openapi.Response(description="Password changed successfully"),
            400: openapi.Response(
                description="Invalid input or incorrect old password"
            ),
        },
    )
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            old_password = serializer.validated_data["old_password"]
            new_password = serializer.validated_data["new_password"]
            if not user.check_password(old_password):
                return Response(
                    {"error": _("Old password is incorrect")},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            user.set_password(new_password)
            user.save()
            return Response(
                {"message": _("Password changed successfully")},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
