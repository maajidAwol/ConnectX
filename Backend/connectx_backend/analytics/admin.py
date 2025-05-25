from django.contrib import admin
from .models import (
    Analytics,
    SystemMetrics,
    APIUsage,
    SystemHealth,
    ActivityLog,
    APIUsageLog,
)


@admin.register(Analytics)
class AnalyticsAdmin(admin.ModelAdmin):
    list_display = ("tenant", "metric_type", "value", "date", "created_at")
    list_filter = ("metric_type", "date", "tenant")
    search_fields = ("tenant__name", "metric_type")


@admin.register(SystemMetrics)
class SystemMetricsAdmin(admin.ModelAdmin):
    list_display = (
        "cpu_usage",
        "memory_usage",
        "storage_usage",
        "database_load",
        "timestamp",
    )
    list_filter = ("timestamp",)
    ordering = ("-timestamp",)


@admin.register(APIUsage)
class APIUsageAdmin(admin.ModelAdmin):
    list_display = ("endpoint", "method", "status_code", "tenant", "timestamp")
    list_filter = ("method", "status_code", "tenant")
    search_fields = ("endpoint", "tenant__name")


@admin.register(SystemHealth)
class SystemHealthAdmin(admin.ModelAdmin):
    list_display = ("component", "status", "timestamp")
    list_filter = ("component", "status", "timestamp")
    search_fields = ("message",)


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ("user", "tenant", "role", "action", "timestamp")
    list_filter = ("role", "timestamp", "tenant")
    search_fields = ("user__email", "action", "tenant__name")
    readonly_fields = ("timestamp",)


@admin.register(APIUsageLog)
class APIUsageLogAdmin(admin.ModelAdmin):
    list_display = ("endpoint", "method", "status_code", "user", "tenant", "timestamp")
    list_filter = ("method", "status_code", "tenant")
    search_fields = ("endpoint", "user__email", "tenant__name")
    readonly_fields = ("timestamp", "response_time")
