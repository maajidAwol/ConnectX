from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Product
from .serializers import ProductSerializer

class ProductListCreateView(generics.ListCreateAPIView):

    queryset = Product.objects.all()  
    serializer_class = ProductSerializer 
    permission_classes = [IsAuthenticatedOrReadOnly] 

    def perform_create(self, serializer):

        serializer.save(seller=self.request.user)


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):

    queryset = Product.objects.all()  
    serializer_class = ProductSerializer  
    permission_classes = [IsAuthenticatedOrReadOnly] 
