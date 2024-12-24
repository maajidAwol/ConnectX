from rest_framework import serializers
from .models import Transaction
from orders.models import OrderItem

class TransactionSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='order.user.username', read_only=True)
    total_price = serializers.DecimalField(source='order.total_price', max_digits=10, decimal_places=2, read_only=True)
    products = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = ['id', 'order', 'user', 'total_price', 'products', 'transaction_type', 'payment_status', 'timestamp']

    def get_products(self, obj):
        # Fetch the products related to the order
        order_items = OrderItem.objects.filter(order=obj.order)
        return [
            {
                'product_name': item.product.name,
                'quantity': item.quantity,
                'price': item.price
            }
            for item in order_items
        ]
