from rest_framework import generics, permissions
from .models import Transaction
from .serializers import TransactionSerializer

# List and Create Transactions
class TransactionListCreateView(generics.ListCreateAPIView):
    queryset = Transaction.objects.all()
    permission_classes = [permissions.AllowAny]  # Changed line
    serializer_class = TransactionSerializer

    def perform_create(self, serializer):
        serializer.save()

# Retrieve, Update, and Delete Transaction
class TransactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Transaction.objects.all()
    permission_classes = [permissions.AllowAny]  # Changed line
    serializer_class = TransactionSerializer
