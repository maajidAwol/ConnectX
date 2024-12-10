from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'  # Or specify fields explicitly, e.g., ['id', 'transaction_type', 'quantity', 'timestamp', 'product']