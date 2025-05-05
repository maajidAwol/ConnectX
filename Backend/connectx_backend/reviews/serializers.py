from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            "id",
            "tenant",
            "product",
            "user",
            "rating",
            "comment",
            "is_purchased",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]
        swagger_schema_fields = {
            "example": {
                "id": "rev-uuid-1234-5678-90ab-cdef12345678",
                "tenant": "tenant-uuid",
                "product": "product-uuid",
                "user": "user-uuid",
                "rating": 5,
                "comment": "Great product! Highly recommended.",
                "is_purchased": True,
                "created_at": "2025-04-30T12:00:00Z",
            }
        }

    def validate_rating(self, value):
        """Ensure rating is between 1 and 5"""
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value
