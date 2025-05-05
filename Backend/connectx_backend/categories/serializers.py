from rest_framework import serializers
from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"
        swagger_schema_fields = {
            "example": {
                "id": "c1d2e3f4-5678-90ab-cdef-1234567890ab",
                "tenant": "tenant-uuid",
                "name": "Electronics",
                "parent": None,
                "created_at": "2025-04-30T12:00:00Z",
                "updated_at": "2025-04-30T12:00:00Z",
            }
        }
