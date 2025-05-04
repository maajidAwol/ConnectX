from rest_framework import serializers, filters
from .models import Product
from categories.serializers import CategorySerializer


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Product._meta.get_field("category").related_model.objects.all(),
        write_only=True,
        required=True,
        source="category",
    )
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "name",
        "sku",
        "description",
        "short_description",
        "brand",
        "category__name",
    ]

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["category"] = CategorySerializer(instance.category).data
        return ret

    class Meta:
        model = Product
        fields = [
            "id",
            "tenant",
            "owner",
            "sku",
            "name",
            "base_price",
            "profit_percentage",
            "selling_price",
            "quantity",
            "category",
            "category_id",
            "is_public",
            "description",
            "cover_url",
            "images",
            "colors",
            "sizes",
            "total_sold",
            "total_ratings",
            "total_reviews",
        ]
        read_only_fields = [
            "id",
            "tenant",
            "owner",
            "category",
            "total_sold",
            "total_ratings",
            "total_reviews",
        ]
        swagger_schema_fields = {
            "example":{
                "sku": "SKU-001",
                "name": "Smartphone X",
                "base_price": "500.00", 
                "profit_percentage": "20.00",
                "selling_price": "600.00",
                "quantity": 100,
                "category_id": "uuid-of-category",
                "is_public": True,
                "description": "Latest model with advanced features.",
                "cover_url": "https://example.com/image.jpg",
                "images": [
                    "https://example.com/image1.jpg",
                    "https://example.com/image2.jpg",
                ],
                "colors": ["Black", "White"],
                "sizes": ["64GB", "128GB"],
            }
        }
