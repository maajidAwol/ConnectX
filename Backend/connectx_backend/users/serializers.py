from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = "__all__"
        extra_kwargs = {"password": {"write_only": True}}
        read_only_fields = ['id', 'is_staff', 'is_active', 'tenant', 'created_at', 'updated_at']
        swagger_schema_fields = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "tenant": "tenant-uuid",
                "name": "John Doe",
                "email": "john@example.com",
                "password": "yourpassword",
                "role": "customer",
                "is_verified": True,
                "avatar_url": "https://example.com/avatar.jpg",
            }
        }

    def create(self, validated_data):
        # Use set_password to securely hash passwords
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user
