from rest_framework import serializers
from .models import Analytics


class AnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analytics
        fields = "__all__"
        swagger_schema_fields = {
            "example": {
                "id": "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
                "tenant": "tenant-uuid",
                "product": "product-uuid",
                "metric_type": "sales",
                "value": "1500.00",
                "date": "2025-04-30",
                "created_at": "2025-04-30T12:00:00Z",
            }
        }
