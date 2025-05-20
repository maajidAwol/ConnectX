from rest_framework import serializers
from .models import ApiKey


class ApiKeySerializer(serializers.ModelSerializer):
    class Meta:
        model = ApiKey
        
        fields = ["id", "name", "key", "is_active", "created_at", "revoked_at"]
        read_only_fields = ["key", "created_at", "revoked_at"]

    def to_representation(self, instance):
        """
        Only include the key in the response when the object is being created.
        """
        data = super().to_representation(instance)
        if not self.context.get("is_create", False):
            data.pop("key", None)
        return data
