from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.db import transaction
from rest_framework.exceptions import ValidationError
from .utils.email_utils import send_verification_email

User = get_user_model()


class ResendEmailVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()


class UserSerializer(serializers.ModelSerializer):
    tenant_name = serializers.StringRelatedField(source="tenant.name", read_only=True)
    tenant_id = serializers.UUIDField(source="tenant.id", read_only=True)
    groups = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Group.objects.all(), required=False
    )

    class Meta:
        model = User
        fields = [
            "id",
            "name",
            "email",
            "phone_number",
            "password",
            "role",
            "tenant",
            "bio",
            "tenant_name",
            "tenant_id",
            "avatar_url",
            "is_active",
            "is_verified",
            "created_at",
            "updated_at",
            "groups",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
            "email": {"required": True},
            "tenant": {"required": True},
        }
        read_only_fields = [
            "id",
            "is_staff",
            "is_active",
            "created_at",
            "updated_at",
        ]
        swagger_schema_fields = {
            "required": ["email", "password", "name"],
            "properties": {
                "email": {
                    "type": "string",
                    "format": "email",
                    "description": "Email address of the user",
                },
                "password": {
                    "type": "string",
                    "format": "password",
                    "description": "Password for the user",
                },
                "name": {
                    "type": "string",
                    "description": "Full name of the user",
                },
                "role": {
                    "type": "string",
                    "enum": ["admin", "customer", "owner"],
                    "description": "Role of the user in the system",
                },
                "tenant": {
                    "type": "string",
                    "format": "uuid",
                    "description": "ID of the tenant the user belongs to",
                },
            },
        }

    def create(self, validated_data):
        """Create a new user with encrypted password."""
        # Remove groups to handle separately
        groups = None
        if "groups" in validated_data:
            groups = validated_data.pop("groups")

        with transaction.atomic():
            # Create the user without groups
            user = User(**validated_data)
            user.set_password(validated_data["password"])
            user.save()

            # Add groups after user is created
            if groups:
                user.groups.set(groups)

            # Send verification email after user is created
            send_verification_email(user)

            return user

    def update(self, instance, validated_data):
        """Update a user, correctly handling the password."""
        password = validated_data.pop("password", None)
        groups = validated_data.pop("groups", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        if groups is not None:
            instance.groups.set(groups)

        instance.save()
        return instance


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    class Meta:
        swagger_schema_fields = {
            "required": ["email"],
            "properties": {
                "email": {
                    "type": "string",
                    "format": "email",
                    "description": "Email address of the user requesting password reset",
                }
            },
        }


class PasswordResetSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=8)

    class Meta:
        swagger_schema_fields = {
            "required": ["token", "new_password"],
            "properties": {
                "token": {
                    "type": "string",
                    "description": "Password reset token sent to the user's email",
                },
                "new_password": {
                    "type": "string",
                    "format": "password",
                    "description": "New password for the user",
                },
            },
        }
