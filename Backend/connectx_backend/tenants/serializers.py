from rest_framework import serializers
from .models import Tenant

class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = ["id", "name", "api_key", "email", "products", "created_at", "updated_at"]
        read_only_fields = ["id", "api_key", "created_at", "updated_at"]
