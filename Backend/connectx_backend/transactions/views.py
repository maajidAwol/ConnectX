# from rest_framework import generics, permissions
# from .models import Transaction
# from .serializers import TransactionSerializer

# # List and Create Transactions
# class TransactionListCreateView(generics.ListCreateAPIView):
#     queryset = Transaction.objects.all()
#     permission_classes = [permissions.AllowAny]  # Changed line
#     serializer_class = TransactionSerializer

#     def perform_create(self, serializer):
#         serializer.save()

# # Retrieve, Update, and Delete Transaction
# class TransactionDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Transaction.objects.all()
#     permission_classes = [permissions.AllowAny]  # Changed line
#     serializer_class = TransactionSerializer
from rest_framework import generics, permissions
from .models import Transaction
from .serializers import TransactionSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

# List and Create Transactions
class TransactionListCreateView(generics.ListCreateAPIView):
    queryset = Transaction.objects.all()
    permission_classes = [permissions.AllowAny]  # Changed line
    serializer_class = TransactionSerializer

    @swagger_auto_schema(
        operation_summary="List and Create Transactions",
        operation_description="Retrieve all transactions or create a new one. Each transaction is linked to an order, and includes details such as transaction type, payment status, and timestamp.",
        responses={
            200: TransactionSerializer(many=True),  # Response for a GET request
            201: TransactionSerializer,            # Response for a POST request
        },
        request_body=TransactionSerializer,       # For POST requests
    )
    def get(self, request, *args, **kwargs):
        """Handle GET requests to list all transactions."""
        return super().get(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Create a Transaction",
        operation_description="Create a new transaction by providing order, transaction type, and payment status.",
        responses={201: TransactionSerializer},
    )
    def post(self, request, *args, **kwargs):
        """Handle POST requests to create a new transaction."""
        return super().post(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save()


# Retrieve, Update, and Delete Transaction
class TransactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Transaction.objects.all()
    permission_classes = [permissions.AllowAny]  # Changed line
    serializer_class = TransactionSerializer

    @swagger_auto_schema(
        operation_summary="Retrieve a Transaction",
        operation_description="Fetch details of a specific transaction by its ID.",
        responses={200: TransactionSerializer},
    )
    def get(self, request, *args, **kwargs):
        """Handle GET requests to retrieve a transaction."""
        return super().get(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Update a Transaction",
        operation_description="Update an existing transaction by its ID. Provide updated data for the transaction.",
        responses={200: TransactionSerializer},
    )
    def put(self, request, *args, **kwargs):
        """Handle PUT requests to update a transaction."""
        return super().put(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Delete a Transaction",
        operation_description="Delete a specific transaction by its ID.",
        responses={204: "No Content"},
    )
    def delete(self, request, *args, **kwargs):
        """Handle DELETE requests to remove a transaction."""
        return super().delete(request, *args, **kwargs)
