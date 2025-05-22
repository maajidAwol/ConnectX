import time
import json
from django.utils.deprecation import MiddlewareMixin
from .models import APIUsageLog


class APIUsageLoggingMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # Store the start time
        request._start_time = time.time()

        # Store request body if it exists and hasn't been read
        if request.method in ["POST", "PUT", "PATCH"]:
            try:
                request._body = request.body
            except Exception:
                request._body = None

    def process_response(self, request, response):
        # Skip logging for admin analytics endpoints to avoid infinite recursion
        if request.path.startswith("/admin/analytics/"):
            return response

        # Calculate response time
        if hasattr(request, "_start_time"):
            response_time = (
                time.time() - request._start_time
            ) * 1000  # Convert to milliseconds
        else:
            response_time = 0

        # Get request data (excluding sensitive information)
        request_data = None
        if hasattr(request, "_body") and request._body:
            try:
                request_data = json.loads(request._body)
                # Remove sensitive fields
                if isinstance(request_data, dict):
                    for field in ["password", "token", "api_key"]:
                        request_data.pop(field, None)
            except json.JSONDecodeError:
                pass

        # Get response data
        response_data = None
        if hasattr(response, "content"):
            try:
                response_data = json.loads(response.content)
            except json.JSONDecodeError:
                pass

        try:
            # Create API usage log
            APIUsageLog.objects.create(
                user=request.user if request.user.is_authenticated else None,
                tenant=request.user.tenant if hasattr(request.user, "tenant") else None,
                endpoint=request.path,
                method=request.method,
                status_code=response.status_code,
                response_time=response_time,
                request_data=request_data,
                response_data=response_data,
                ip_address=self.get_client_ip(request),
            )
        except Exception as e:
            # Log the error but don't break the response
            print(f"Error logging API usage: {str(e)}")

        return response

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            ip = x_forwarded_for.split(",")[0]
        else:
            ip = request.META.get("REMOTE_ADDR")
        return ip
