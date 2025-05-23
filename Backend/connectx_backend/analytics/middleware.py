import time
import json
from django.utils import timezone
from .models import APIUsageLog
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


class APIUsageLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # Fields to exclude from logging
        self.sensitive_fields = {
            "password",
            "token",
            "api_key",
            "secret",
            "authorization",
            "credit_card",
            "cvv",
            "ssn",
            "social_security",
        }

    def __call__(self, request):
        # Start timing the request
        start_time = time.time()

        # Process the request
        response = self.get_response(request)

        # Calculate response time
        response_time = time.time() - start_time

        # Only log API requests
        request_data = None
        if request.path.startswith("/api/"):
            try:
                # Get request data safely
                request_data = {}
                if (
                    request.content_type
                    and "multipart/form-data" in request.content_type
                ):
                    # For multipart form data, get form data and files separately
                    form_data = dict(request.POST.items())
                    # Filter sensitive data from form data
                    form_data = self._filter_sensitive_data(form_data)
                    request_data = {
                        "form_data": form_data,
                        "files": (
                            [f.name for f in request.FILES.values()]
                            if request.FILES
                            else []
                        ),
                    }
                elif request.body:
                    try:
                        # Try to parse JSON body
                        request_data = json.loads(request.body)
                        # Filter sensitive data from JSON
                        request_data = self._filter_sensitive_data(request_data)
                    except (json.JSONDecodeError, UnicodeDecodeError):
                        # If not JSON, store as raw string
                        request_data = {"raw_body": str(request.body)}

                # Get response data safely
                response_data = None
                if hasattr(response, "data"):
                    try:
                        response_data = self._filter_sensitive_data(response.data)
                    except Exception as e:
                        logger.warning(f"Error processing response data: {str(e)}")
                        response_data = {"error": "Could not process response data"}

                # Create API usage log
                APIUsageLog.objects.create(
                    endpoint=request.path,
                    method=request.method,
                    status_code=response.status_code,
                    response_time=response_time,
                    user=(
                        request.user
                        if hasattr(request, "user") and request.user.is_authenticated
                        else None
                    ),
                    tenant=request.tenant if hasattr(request, "tenant") else None,
                    request_data=request_data,
                    response_data=response_data,
                    timestamp=timezone.now(),
                    ip_address=self.get_client_ip(request),
                )
            except Exception as e:
                # Log the error but don't interrupt the request
                logger.error(f"Error logging API usage: {str(e)}")

        return response

    def get_client_ip(self, request):
        """Get the client's IP address from the request."""
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            ip = x_forwarded_for.split(",")[0].strip()
        else:
            ip = request.META.get("REMOTE_ADDR", "0.0.0.0")
        return ip

    def _filter_sensitive_data(self, data):
        """Filter out sensitive data from request/response data."""
        if isinstance(data, dict):
            return {
                k: (
                    "***FILTERED***"
                    if any(
                        sensitive in k.lower() for sensitive in self.sensitive_fields
                    )
                    else self._filter_sensitive_data(v)
                )
                for k, v in data.items()
            }
        elif isinstance(data, list):
            return [self._filter_sensitive_data(item) for item in data]
        return data
