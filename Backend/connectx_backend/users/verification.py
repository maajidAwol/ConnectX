from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import SimpleRateThrottle
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from .utils.jwt_utils import decode_email_verification_token
from .utils.email_utils import send_verification_email
from rest_framework.permissions import AllowAny
from django.utils.translation import gettext_lazy as _
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .serializers import ResendEmailVerificationSerializer, UserSerializer


User = get_user_model()


class ResendVerificationThrottle(SimpleRateThrottle):
    rate = "1/minute"

    def get_cache_key(self, request, view):
        if request.user.is_authenticated:
            return f"resend_verification_{request.user.email}"
        return f"resend_verification_{request.data.get('email')}"


class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name="token",
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                description="JWT email verification token",
                required=True,
            )
        ],
        responses={
            200: openapi.Response("Email verified successfully"),
            400: openapi.Response("Missing or invalid token"),
        },
    )
    def get(self, request):
        token = request.query_params.get("token")
        if not token:
            return Response(
                {"error": _("Token is required")}, status=status.HTTP_400_BAD_REQUEST
            )

        payload = decode_email_verification_token(token)
        if not payload:
            return Response(
                {"error": _("Invalid or expired token")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(id=payload["user_id"], email=payload["email"])
        except User.DoesNotExist:
            return Response(
                {"error": _("User not found")}, status=status.HTTP_404_NOT_FOUND
            )

        if user.is_verified:
            return Response(
                {"error": _("Email already verified")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.is_verified = True
        user.save()

        return Response(
            {"message": _("Email successfully verified")}, status=status.HTTP_200_OK
        )


class ResendVerificationView(APIView):
    throttle_classes = [ResendVerificationThrottle]
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        request_body=ResendEmailVerificationSerializer,
        responses={
            200: openapi.Response(description="Verification email sent successfully"),
            400: openapi.Response(
                description="Email already verified or invalid input"
            ),
            404: openapi.Response(description="User not found"),
            500: openapi.Response(description="Failed to send verification email"),
        },
    )
    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response(
                {"error": _("Email is required")}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error": _("User not found")}, status=status.HTTP_404_NOT_FOUND
            )

        if user.is_verified:
            return Response(
                {"error": _("Email already verified")},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        if send_verification_email(user):
            return Response(
                {
                    "message": _("Verification email sent successfully"),
                    "user": UserSerializer(user).data,
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"error": _("Failed to send verification email")},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
