from rest_framework import authentication
from rest_framework import exceptions
from django.utils import timezone
from .models import ApiKey


class ApiKeyAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        api_key = request.headers.get("X-API-KEY")
        if not api_key:
            return None

        try:
            api_key_obj = ApiKey.objects.select_related("tenant").get(
                key=api_key, is_active=True, revoked_at__isnull=True
            )
        except ApiKey.DoesNotExist:
            raise exceptions.AuthenticationFailed("Invalid or inactive API key")

        # Set the tenant on the request object
        request.tenant = api_key_obj.tenant

        # Return (None, None) to indicate anonymous but authenticated access
        return (None)
    def authenticate_header(self, request):
        return "X-API-KEY"
