import uuid
from django.db import models
from tenants.models import Tenant
from products.models import Product
from users.models import User


class Analytics(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(
        Tenant, on_delete=models.CASCADE, related_name="analytics"
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="analytics",
    )
    metric_type = models.CharField(
        max_length=50,
        choices=[
            ("sales", "Sales"),
            ("orders", "Orders"),
            ("revenue", "Revenue"),
        ],
    )
    value = models.DecimalField(max_digits=15, decimal_places=2)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.metric_type} - {self.value} for {self.tenant.name}"


class ActivityLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="activity_logs"
    )
    tenant = models.ForeignKey(
        Tenant, on_delete=models.SET_NULL, null=True, related_name="activity_logs"
    )
    role = models.CharField(
        max_length=20,
        choices=[
            ("admin", "Admin"),
            ("owner", "Owner"),
            ("member", "Member"),
            ("customer", "Customer"),
        ],
    )
    action = models.CharField(max_length=255)
    details = models.JSONField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        ordering = ["-timestamp"]
        indexes = [
            models.Index(fields=["timestamp"]),
            models.Index(fields=["user"]),
            models.Index(fields=["tenant"]),
            models.Index(fields=["role"]),
        ]

    def __str__(self):
        return f"{self.role} - {self.action} at {self.timestamp}"


class APIUsageLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="api_logs"
    )
    tenant = models.ForeignKey(
        Tenant, on_delete=models.SET_NULL, null=True, related_name="api_logs"
    )
    endpoint = models.CharField(max_length=255)
    method = models.CharField(max_length=10)
    status_code = models.IntegerField()
    response_time = models.FloatField()  # in milliseconds
    request_data = models.JSONField(null=True, blank=True)
    response_data = models.JSONField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        ordering = ["-timestamp"]
        indexes = [
            models.Index(fields=["timestamp"]),
            models.Index(fields=["user"]),
            models.Index(fields=["tenant"]),
            models.Index(fields=["endpoint"]),
        ]

    def __str__(self):
        return f"{self.method} {self.endpoint} - {self.status_code} at {self.timestamp}"


class SystemMetrics(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cpu_usage = models.FloatField()
    memory_usage = models.FloatField()
    storage_usage = models.FloatField()
    database_load = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]

    def __str__(self):
        return f"System Metrics at {self.timestamp}"


class APIUsage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    endpoint = models.CharField(max_length=255)
    method = models.CharField(max_length=10)
    response_time = models.FloatField()  # in milliseconds
    status_code = models.IntegerField()
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]

    def __str__(self):
        return f"{self.method} {self.endpoint} - {self.status_code}"


class SystemHealth(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    status = models.CharField(
        max_length=20,
        choices=[
            ("healthy", "Healthy"),
            ("warning", "Warning"),
            ("critical", "Critical"),
        ],
    )
    component = models.CharField(
        max_length=50,
        choices=[
            ("api", "API"),
            ("database", "Database"),
            ("storage", "Storage"),
            ("memory", "Memory"),
        ],
    )
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]

    def __str__(self):
        return f"{self.component} - {self.status} at {self.timestamp}"
