from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="ConnectX API",
        default_version='v1',
        description="API documentation for ConnectX multi-tenant e-commerce platform",
        terms_of_service="https://www.connectx.com/terms/",
        contact=openapi.Contact(email="contact@connectx.com"),
        license=openapi.License(name="Proprietary License"),
    ),
    
    public=True,
    permission_classes=(permissions.AllowAny,),
    authentication_classes=[],
)


urlpatterns = [
    path("admin/", admin.site.urls),
    
    # Root URL - Show Swagger UI
    path("", schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui-root'),
    
    # API Documentation
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # API Endpoints
    path("api/", include("users.urls")),
    path("api/", include("tenants.urls")),
    path("api/", include("products.urls")),
    path("api/", include("orders.urls")),
    path("api/", include("payments.urls")),
    path("api/", include("shipping.urls")),
    path("api/", include("categories.urls")),
    path("api/", include("analytics.urls")),
    path("api/", include("reviews.urls")),
    path("api/", include("api_keys.urls")),
    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
