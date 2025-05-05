from rest_framework import serializers
from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ['id', 'tenant', 'created_at', 'updated_at']
        swagger_schema_fields = {
            "example": {
                "name": "Electronics",
                "description": "All electronic items",
                "icon": "icon-url",
                "parent": None,
            }
        }
