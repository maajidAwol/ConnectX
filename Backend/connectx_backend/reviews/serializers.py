from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'tenant', 'product', 'user', 'rating', 'comment', 'is_purchased', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_rating(self, value):
        """Ensure rating is between 1 and 5"""
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value
