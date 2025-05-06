from rest_framework import serializers, filters
from .models import Product, ProductListing
from categories.serializers import CategorySerializer


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Product._meta.get_field("category").related_model.objects.all(),
        write_only=True,
        required=True,
        source="category",
    )
    profit_percentage = serializers.SerializerMethodField()
    selling_price = serializers.SerializerMethodField()

    filter_backends = [filters.SearchFilter]
    search_fields = [
        "name",
        "sku",
        "description",
        "short_description",
        "brand",
        "category__name",
    ]

    def get_profit_percentage(self, obj):
        request = self.context.get("request")
        if not request or not hasattr(request.user, "tenant"):
            return None

        listing = ProductListing.objects.filter(product=obj, tenant=request.user.tenant).first()
        return listing.profit_percentage if listing else None

    def get_selling_price(self, obj):
        request = self.context.get("request")
        if not request or not hasattr(request.user, "tenant"):
            return None

        listing = ProductListing.objects.filter(product=obj, tenant=request.user.tenant).first()
        return listing.selling_price if listing else None

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
            "short_description",
            "tag",
            "brand",
            "additional_info",
            "warranty",
            "cover_url",
            "images",
            "colors",
            "sizes",
            "total_sold",
            "total_ratings",
            "total_reviews",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "tenant",
            "owner",
            "category",
            "total_sold",
            "total_ratings",
            "total_reviews",
            "created_at",
            "updated_at",
            "profit_percentage",
            "selling_price",
        ]
        swagger_schema_fields = {
            "example": {
                "sku": "SKU-001",
                "name": "Smartphone X",
                "base_price": "500.00",
                "quantity": 100,
                "category_id": "733195c9-c31a-41ab-be6d-bf4d93338eab",
                "is_public": True,
                "description": "Latest model with advanced features.",
                "short_description": "Compact and powerful.",
                "tag": ["electronics", "smartphone"],
                "brand": "BrandX",
                "additional_info": {"battery": "4000mAh", "processor": "Octa-core"},
                "warranty": "1 year",
                "cover_url": "https://example.com/image.jpg",
                "images": [
                    "https://example.com/image1.jpg",
                    "https://example.com/image2.jpg",
                ],
                "colors": ["Black", "White"],
                "sizes": ["64GB", "128GB"],
            }
        }
