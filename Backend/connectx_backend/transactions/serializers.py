# from rest_framework import serializers
# from .models import Transaction

# class TransactionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Transaction
#         fields = ['id', 'transaction_type', 'quantity', 'timestamp', 'product_name', 'product_price']  # Added product_name and product_price

from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'

