from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "tenant", "name", "email", "password", "role", "is_verified", "avatar_url", "created_at", "updated_at"]
        extra_kwargs = {"password": {"write_only": True}}
        read_only_fields = ['id', 'is_staff']

    def create(self, validated_data):
        # Use set_password to securely hash passwords
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user
