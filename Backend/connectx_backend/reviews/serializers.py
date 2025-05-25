from rest_framework import serializers
from .models import Review
from users.serializers import UserSerializer


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Review
        fields = [
            "id",
            "tenant",
            "product",
            "user",
            "user_name",
            "user_email",
            "rating",
            "comment",
            "is_purchased",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "tenant", "user", "is_purchased", "user_name", "user_email"]
        swagger_schema_fields = {
            "example": {
                "id": "rev-uuid-1234-5678-90ab-cdef12345678",
                "tenant": "tenant-uuid",
                "product": "product-uuid",
                "user": "user-uuid",
                "user_name": "John Doe",
                "user_email": "john@example.com",
                "rating": 5,
                "comment": "Great product! Highly recommended.",
                "is_purchased": True,
                "created_at": "2025-04-30T12:00:00Z",
                "updated_at": "2025-04-30T12:00:00Z",
            }
        }

    def validate_rating(self, value):
        """Ensure rating is between 1 and 5"""
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value


class ReviewStatsSerializer(serializers.Serializer):
    """Serializer for review statistics"""
    total_reviews = serializers.IntegerField()
    average_rating = serializers.FloatField()
    rating_distribution = serializers.DictField()
    
    class Meta:
        swagger_schema_fields = {
            "example": {
                "total_reviews": 150,
                "average_rating": 4.2,
                "rating_distribution": {
                    "1": 5,
                    "2": 10,
                    "3": 25,
                    "4": 60,
                    "5": 50
                }
            }
        }


class ProductReviewSummarySerializer(serializers.Serializer):
    """Serializer for product review summary with statistics"""
    reviews = ReviewSerializer(many=True)
    stats = ReviewStatsSerializer()
    
    class Meta:
        swagger_schema_fields = {
            "example": {
                "reviews": [
                    {
                        "id": "rev-uuid-1234-5678-90ab-cdef12345678",
                        "rating": 5,
                        "comment": "Great product!",
                        "user_name": "John Doe",
                        "created_at": "2025-04-30T12:00:00Z"
                    }
                ],
                "stats": {
                    "total_reviews": 150,
                    "average_rating": 4.2,
                    "rating_distribution": {
                        "1": 5,
                        "2": 10,
                        "3": 25,
                        "4": 60,
                        "5": 50
                    }
                }
            }
        }
