import uuid
from django.db import models
from tenants.models import Tenant
from products.models import Product

class Analytics(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="analytics")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True, related_name="analytics")
    metric_type = models.CharField(max_length=50, choices=[
        ("sales", "Sales"),
        ("orders", "Orders"),
        ("revenue", "Revenue"),
    ])
    value = models.DecimalField(max_digits=15, decimal_places=2)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.metric_type} - {self.value} for {self.tenant.name}"
