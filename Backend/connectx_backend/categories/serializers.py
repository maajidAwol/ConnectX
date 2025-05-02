from rest_framework import serializers
from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields =['id', 'name', 'description']
        swagger_schema_fields = {
            "example": {
                "id": "c1d2e3f4-5678-90ab-cdef-1234567890ab",
                "tenant": "tenant-uuid",
                "name": "Electronics",
                "parent": None,
            }
        }
