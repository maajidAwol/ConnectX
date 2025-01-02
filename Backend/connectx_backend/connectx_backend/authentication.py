import logging
from rest_framework_simplejwt.authentication import JWTAuthentication

logger = logging.getLogger('my_custom_logger')

class LoggingJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Log the Authorization header
        auth_header = request.headers.get('Authorization', '')
        logger.debug(f"Authorization header: {auth_header}")

        # Call the parent authenticate method
        return super().authenticate(request)
from rest_framework.permissions import BasePermission
from rest_framework_simplejwt.authentication import JWTAuthentication

class IsAuthenticatedWithCustomToken(BasePermission):
    def has_permission(self, request, view):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return False

        token = auth_header.split(' ')[1]
        jwt_auth = JWTAuthentication()

        try:
            validated_token = jwt_auth.get_validated_token(token)
            request.user = jwt_auth.get_user(validated_token)
            return True
        except Exception:
            return False