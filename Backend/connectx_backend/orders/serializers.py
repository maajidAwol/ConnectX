from rest_framework import serializers
from .models import Order, OrderProductItem

class OrderProductItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderProductItem
        fields = [
            "id",
            "order",
            "product",
            "quantity",
            "price",
            "custom_profit_percentage",
            "custom_selling_price",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ("id", "created_at", "updated_at", "order")
        swagger_schema_fields = {
            "example": {
                "product": "product-uuid",
                "quantity": 2,
                "price": "299.99",
                "custom_profit_percentage": 10.0,
                "custom_selling_price": "329.99"
            }
        }

class OrderSerializer(serializers.ModelSerializer):
    items = OrderProductItemSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "tenant",
            "user",
            "order_number",
            "status",
            "subtotal",
            "taxes",
            "shipping",
            "discount",
            "total_amount",
            "created_at",
            "updated_at",
            "shipping_address",
            "items",
        ]
        read_only_fields = ("id", "created_at", "updated_at", "total_amount")
        swagger_schema_fields = {
            "example": {
                "tenant": "tenant-uuid",
                "user": "user-uuid",
                "order_number": "ORD-20250430-001",
                "status": "pending",
                "subtotal": "500.00",
                "taxes": "50.00",
                "shipping": "20.00",
                "discount": "10.00",
                "shipping_address": "shipping-address-uuid",
                "items": [
                    {
                        "product": "product-uuid",
                        "quantity": 2,
                        "price": "299.99",
                        "custom_profit_percentage": 10.0,
                        "custom_selling_price": "329.99"
                    }
                ]
            }
        }

    def create(self, validated_data):
        """Handle nested product items when creating an order."""
        items_data = validated_data.pop("items")
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderProductItem.objects.create(order=order, **item_data)
        return order
