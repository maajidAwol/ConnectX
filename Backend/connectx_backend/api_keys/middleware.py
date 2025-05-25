from django.utils.deprecation import MiddlewareMixin
from .models import ApiKey


class APIKeyTenantMiddleware(MiddlewareMixin):
    def process_request(self, request):
        api_key = request.headers.get('X-API-KEY') or request.GET.get('api_key')
        if api_key:
            try:
                key = ApiKey.objects.select_related('tenant').get(key=api_key, is_active=True)
                request.tenant = key.tenant
            except ApiKey.DoesNotExist:
                request.tenant = None
        else:
            request.tenant = None
