from rest_framework import authentication
from rest_framework import exceptions
from django.utils import timezone
from .models import ApiKey
from django.contrib.auth.models import AnonymousUser


class ApiKeyAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        api_key = request.headers.get("X-API-KEY")
        if not api_key:
            request._request.tenant = None
            return None

        try:
            api_key_obj = ApiKey.objects.select_related("tenant").get(
                key=api_key, is_active=True, revoked_at__isnull=True
            )
        except ApiKey.DoesNotExist:
            raise exceptions.AuthenticationFailed("Invalid or inactive API key")

        # Only set tenant if not already set
        if not hasattr(request, "tenant"):
            request.tenant = api_key_obj.tenant

        # Return an AnonymousUser, so DRF knows authentication succeeded
        return (AnonymousUser(), api_key_obj)

    def authenticate_header(self, request):
        return "X-API-KEY"
