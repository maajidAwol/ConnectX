from rest_framework import serializers
from .models import Category
from utils import upload_image


class CategorySerializer(serializers.ModelSerializer):
    icon = serializers.ImageField(write_only=True, required=False)

    class Meta:
        model = Category
        fields = "__all__"
        read_only_fields = ["id", "tenant", "created_at", "updated_at"]
        swagger_schema_fields = {
            "example": {
                "name": "Electronics",
                "description": "All electronic items",
                "icon": "file",
                "parent": None,
            }
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.icon:
            data["icon"] = instance.icon
        return data

    def create(self, validated_data):
        icon_file = validated_data.pop("icon", None)
        if icon_file:
            upload_result = upload_image(icon_file, folder="categories")
            if upload_result["success"]:
                validated_data["icon"] = upload_result["url"]
        print(validated_data)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        icon_file = validated_data.pop("icon", None)
        if icon_file:
            upload_result = upload_image(icon_file, folder="categories")
            if upload_result["success"]:
                validated_data["icon"] = upload_result["url"]
        return super().update(instance, validated_data)
