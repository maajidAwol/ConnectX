from rest_framework import serializers
from .models import StockRequest

class StockRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockRequest
        fields = '__all__'
