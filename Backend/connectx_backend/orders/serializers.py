# from rest_framework import serializers
# from .models import Order, OrderItem

# class OrderItemSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = OrderItem
#         fields = '__all__'

# class OrderSerializer(serializers.ModelSerializer):
#     items = OrderItemSerializer(many=True, read_only=True)

#     class Meta:
#         model = Order
#         fields = '__all__'
from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'total_price', 'created_at', 'status', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        if items_data:
            instance.items.all().delete()
            for item_data in items_data:
                OrderItem.objects.create(order=instance, **item_data)
        instance.total_price = validated_data.get('total_price', instance.total_price)
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance
