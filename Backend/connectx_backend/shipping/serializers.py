from rest_framework import serializers
from .models import OrderShippingAddress

class OrderShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderShippingAddress
        fields = "__all__"
