from rest_framework import serializers, filters
from .models import Product, ProductListing
from categories.serializers import CategorySerializer
import uuid
from django.db import models
from tenants.models import Tenant
from users.models import User
from categories.models import Category
from decimal import Decimal, InvalidOperation
from rest_framework.exceptions import ValidationError
from utils import (
    upload_image,
    delete_image,
    generate_image_url,
)  # Import Cloudinary utils


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
    base_price = serializers.DecimalField(
        max_digits=10, decimal_places=2, required=True
    )
    name = serializers.CharField(required=True)
    sku = serializers.CharField(read_only=True)

    # Add fields for file uploads
    cover_image_upload = serializers.ImageField(
        write_only=True, required=False, allow_null=True
    )
    images_upload = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False,
        allow_empty=True,
    )

    # Add review summary fields
    review_summary = serializers.SerializerMethodField()

    filter_backends = [filters.SearchFilter]
    search_fields = [
        "name",
        "sku",
        "description",
        "short_description",
        "brand",
        "category__name",
    ]

    def validate(self, data):
        """Validate the product data."""
        if "base_price" in data and data["base_price"] <= 0:
            raise serializers.ValidationError(
                {"base_price": "Base price must be greater than 0"}
            )
        return data

    def get_profit_percentage(self, obj):
        request = self.context.get("request")
        if not request or not hasattr(request.user, "tenant"):
            return None

        listing = ProductListing.objects.filter(
            product=obj, tenant=request.user.tenant
        ).first()
        return listing.profit_percentage if listing else None

    def get_selling_price(self, obj):
        request = self.context.get("request")
        if not request or not hasattr(request.user, "tenant"):
            return None

        listing = ProductListing.objects.filter(
            product=obj, tenant=request.user.tenant
        ).first()
        return listing.selling_price if listing else None

    def get_review_summary(self, obj):
        """Get review summary for the product."""
        from django.db.models import Avg
        from reviews.models import Review
        
        reviews = Review.objects.filter(product=obj)
        total_reviews = reviews.count()
        
        if total_reviews == 0:
            return {
                "total_reviews": 0,
                "average_rating": 0,
                "rating_distribution": {
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 0
                }
            }
        
        avg_rating = reviews.aggregate(avg_rating=Avg('rating'))['avg_rating'] or 0
        
        # Get rating distribution
        rating_distribution = {}
        for i in range(1, 6):
            count = reviews.filter(rating=i).count()
            rating_distribution[str(i)] = count

        return {
            "total_reviews": total_reviews,
            "average_rating": round(avg_rating, 2) if avg_rating else 0,
            "rating_distribution": rating_distribution
        }

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["category"] = CategorySerializer(instance.category).data

        # Generate Cloudinary URLs for output
        if instance.cover_url:
            ret["cover_url"] = generate_image_url(instance.cover_url)
        else:
            ret["cover_url"] = None  # Or a default image URL

        if instance.images:
            ret["images"] = [
                generate_image_url(public_id) for public_id in instance.images
            ]
        else:
            ret["images"] = []

        return ret

    def create(self, validated_data):
        cover_image_file = validated_data.pop("cover_image_upload", None)
        images_files = validated_data.pop("images_upload", [])
        category_data = validated_data.pop("category", None)

        # Create the product instance, including the category
        # Tenant will be set in the viewset
        product = Product.objects.create(category=category_data, **validated_data)

        # Handle image uploads
        if cover_image_file:
            upload_result = upload_image(cover_image_file, folder="products")
            if upload_result["success"]:
                product.cover_url = upload_result["public_id"]  # Store public ID
            else:
                raise ValidationError(
                    f"Error uploading cover image: {upload_result['error']}"
                )

        if images_files:
            image_public_ids = []
            for image_file in images_files:
                upload_result = upload_image(image_file, folder="products")
                if upload_result["success"]:
                    image_public_ids.append(
                        upload_result["public_id"]
                    )  # Store public IDs
                else:
                    print(
                        f"Warning: Failed to upload image {image_file.name}: {upload_result['error']}"
                    )  # Log failure
            product.images = image_public_ids  # Store list of public IDs

        product.save()  # Save after updating image fields (especially if images were uploaded)

        return product

    def update(self, instance, validated_data):
        cover_image_file = validated_data.pop("cover_image_upload", None)
        images_files = validated_data.pop("images_upload", None)
        category_data = validated_data.pop("category", None)

        # Update product fields excluding category
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Handle category relationship if category_id was provided
        if category_data:
            instance.category = category_data

        # Handle cover image update
        if cover_image_file is not None:
            if instance.cover_url:  # Delete old cover image if it exists
                delete_image(instance.cover_url)

            if cover_image_file:
                upload_result = upload_image(cover_image_file, folder="products")
                if upload_result["success"]:
                    instance.cover_url = upload_result["public_id"]
                else:
                    raise ValidationError(
                        f"Error uploading new cover image: {upload_result['error']}"
                    )
            else:
                instance.cover_url = ""  # Clear cover image if null is provided

        # Handle multiple images update
        if images_files is not None:
            if instance.images:  # Delete old images
                for public_id in instance.images:
                    delete_image(public_id)

            if images_files:
                image_public_ids = []
                for image_file in images_files:
                    upload_result = upload_image(image_file, folder="products")
                    if upload_result["success"]:
                        image_public_ids.append(upload_result["public_id"])
                    else:
                        print(
                            f"Warning: Failed to upload image {image_file.name}: {upload_result['error']}"
                        )  # Log failure
                instance.images = image_public_ids
            else:
                instance.images = []  # Clear images if empty list is provided

        instance.save()  # Save after all updates

        return instance

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
            "cover_url",  # Keep existing fields for output
            "images",  # Keep existing fields for output
            "colors",
            "sizes",
            "total_sold",
            "total_ratings",
            "total_reviews",
            "review_summary",  # Add review summary field
            "created_at",
            "updated_at",
            "cover_image_upload",  # Add upload fields for input
            "images_upload",  # Add upload fields for input
        ]
        read_only_fields = [
            "id",
            "tenant",
            "owner",
            "category",
            "total_sold",
            "total_ratings",
            "total_reviews",
            "review_summary",  # Review summary is read-only
            "created_at",
            "updated_at",
            "profit_percentage",
            "selling_price",
            "cover_url",  # Make these read-only as they are set internally
            "images",  # Make these read-only as they are set internally
            "sku",
        ]
        extra_kwargs = {
            "description": {"required": False},
            "short_description": {"required": False},
            "tag": {"required": False},
            "brand": {"required": False},
            "additional_info": {"required": False},
            "warranty": {"required": False},
            "colors": {"required": False},
            "sizes": {"required": False},
            "quantity": {"required": False},
            "is_public": {"required": False, "default": True},
        }
        swagger_schema_fields = {
            "type": "object",
            "properties": {
                "name": {"type": "string", "example": "Smartphone X"},
                "base_price": {
                    "type": "number",
                    "format": "decimal",
                    "example": "500.00",
                },
                "quantity": {"type": "integer", "example": 100},
                "category_id": {
                    "type": "string",
                    "format": "uuid",
                    "example": "733195c9-c31a-41ab-be6d-bf4d93338eab",
                },
                "is_public": {"type": "boolean", "example": True},
                "description": {
                    "type": "string",
                    "example": "Latest model with advanced features.",
                },
                "short_description": {
                    "type": "string",
                    "example": "Compact and powerful.",
                },
                "tag": {
                    "type": "array",
                    "items": {"type": "string"},
                    "example": ["electronics", "smartphone"],
                },
                "brand": {"type": "string", "example": "BrandX"},
                "additional_info": {
                    "type": "object",
                    "example": {"battery": "4000mAh", "processor": "Octa-core"},
                },
                "warranty": {"type": "string", "example": "1 year"},
                # Define file upload fields for swagger
                "cover_image_upload": {"type": "string", "format": "binary"},
                "images_upload": {
                    "type": "array",
                    "items": {"type": "string", "format": "binary"},
                },
                "colors": {
                    "type": "array",
                    "items": {"type": "string"},
                    "example": ["Black", "White"],
                },
                "sizes": {
                    "type": "array",
                    "items": {"type": "string"},
                    "example": ["64GB", "128GB"],
                },
            },
            "required": ["sku", "name", "base_price", "quantity", "category_id"],
        }


class ProductListingSerializer(serializers.ModelSerializer):
    pass
