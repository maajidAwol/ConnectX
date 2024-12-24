from rest_framework import generics, permissions
from .models import Order
from .serializers import OrderSerializer
class OrderListCreateView(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]  # Changed line
    http_method_names = ['get', 'post']

    def perform_create(self, serializer):
        serializer.save()  # Modified line

class OrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]  # Changed line
    http_method_names = ['get', 'put', 'patch', 'delete']