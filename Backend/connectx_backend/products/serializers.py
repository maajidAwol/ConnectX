from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"
        swagger_schema_fields = {
            "example": {
                "id": "prod-uuid-1234-5678-90ab-cdef12345678",
                "tenant": ["tenant-uuid-1", "tenant-uuid-2"],
                "owner": "user-uuid",
                "sku": "SKU-001",
                "name": "Smartphone X",
                "base_price": "500.00",
                "profit_percentage": "20.00",
                "selling_price": "600.00",
                "quantity": 100,
                "category": "category-uuid",
                "is_public": True,
                "description": "Latest model with advanced features.",
                "cover_url": "https://example.com/image.jpg",
                "images": [
                    "https://example.com/image1.jpg",
                    "https://example.com/image2.jpg",
                ],
                "colors": ["Black", "White"],
                "sizes": ["64GB", "128GB"],
                "total_sold": 50,
                "total_ratings": 40,
                "total_reviews": 30,
                "created_at": "2025-04-30T12:00:00Z",
                "updated_at": "2025-04-30T12:00:00Z",
            }
        }
