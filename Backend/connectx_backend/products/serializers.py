from rest_framework import serializers,filters
from .models import Product
from categories.serializers import CategorySerializer

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'sku', 'description', 'short_description', 'brand', 'category__name']

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
            }
        }
