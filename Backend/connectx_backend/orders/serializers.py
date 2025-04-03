from rest_framework import serializers
from .models import Order, OrderProductItem

class OrderProductItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderProductItem
        fields = "__all__"

class OrderSerializer(serializers.ModelSerializer):
    items = OrderProductItemSerializer(many=True)

    class Meta:
        model = Order
        fields = "__all__"

    def create(self, validated_data):
        """Handle nested product items when creating an order."""
        items_data = validated_data.pop("items")
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderProductItem.objects.create(order=order, **item_data)
        return order
