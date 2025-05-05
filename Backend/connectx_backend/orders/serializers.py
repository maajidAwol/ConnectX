from rest_framework import serializers
from .models import Order, OrderProductItem


class OrderProductItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderProductItem
        fields = "__all__"
        swagger_schema_fields = {
            "example": {
                "id": "f1e2d3c4-b5a6-7890-abcd-1234567890ab",
                "order": "order-uuid",
                "product": "product-uuid",
                "quantity": 2,
                "price": "299.99",
                "custom_profit_percentage": 10.0,
                "custom_selling_price": "329.99",
                "created_at": "2025-04-30T12:00:00Z",
                "updated_at": "2025-04-30T12:00:00Z",
            }
        }


class OrderSerializer(serializers.ModelSerializer):
    items = OrderProductItemSerializer(many=True)

    class Meta:
        model = Order
        fields = "__all__"
        swagger_schema_fields = {
            "example": {
                "id": "aabbccdd-eeff-0011-2233-445566778899",
                "tenant": "tenant-uuid",
                "user": "user-uuid",
                "order_number": "ORD-20250430-001",
                "status": "pending",
                "subtotal": "500.00",
                "taxes": "50.00",
                "shipping": "20.00",
                "discount": "10.00",
                "total_amount": "560.00",
                "created_at": "2025-04-30T12:00:00Z",
                "updated_at": "2025-04-30T12:00:00Z",
                "shipping_address": "shipping-address-uuid",
                "items": [
                    {
                        "id": "item-uuid",
                        "order": "order-uuid",
                        "product": "product-uuid",
                        "quantity": 2,
                        "price": "299.99",
                        "custom_profit_percentage": 10.0,
                        "custom_selling_price": "329.99",
                        "created_at": "2025-04-30T12:00:00Z",
                        "updated_at": "2025-04-30T12:00:00Z",
                    }
                ],
            }
        }

    def create(self, validated_data):
        """Handle nested product items when creating an order."""
        items_data = validated_data.pop("items")
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderProductItem.objects.create(order=order, **item_data)
        return order
