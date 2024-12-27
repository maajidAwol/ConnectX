from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from .models import StockRequest
from .serializers import StockRequestSerializer
from .permissions import IsAdminOrEntrepreneur, IsOwnerOrAdmin, IsAdmin

# Views for StockRequest

import logging
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

logger = logging.getLogger(__name__)
from django.views.decorators.csrf import csrf_exempt
class StockRequestList(generics.ListAPIView):
    # queryset = StockRequest.objects.all()
    # serializer_class = StockRequestSerializer
    # permission_classes = [IsAuthenticated, IsAdminOrEntrepreneur]
    permission_classes = [IsAuthenticated]

    @method_decorator(csrf_exempt)
    def get(self, request, *args, **kwargs):
        # Log the Authorization header for debugging
        logger.info(f"Authorization header: {request.headers.get('Authorization')}")
        return Response({'message': 'Testing response'}, status=200)
    # def get_queryset(self):
    #     user = self.request.user

    #     # Check if the user is authenticated
    #     if user.is_authenticated:
    #         if user.role == User.ENTREPRENEUR:  # Compare role using User model constants
    #             return self.queryset.filter(user=user)
    #         # Optionally filter or raise an error for non-entrepreneurs
    #         raise PermissionDenied("You do not have permission to view this resource.")
        
    #     # Handle unauthenticated users
    #     raise PermissionDenied("Authentication credentials were not provided.")



class StockRequestCreate(generics.CreateAPIView):
    queryset = StockRequest.objects.all()
    serializer_class = StockRequestSerializer
    permission_classes = [IsAuthenticated, IsAdminOrEntrepreneur]


class StockRequestRetrieve(generics.RetrieveAPIView):
    queryset = StockRequest.objects.all()
    serializer_class = StockRequestSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]


class StockRequestUpdate(generics.UpdateAPIView):
    queryset = StockRequest.objects.all()
    serializer_class = StockRequestSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]


class StockRequestDelete(generics.DestroyAPIView):
    queryset = StockRequest.objects.all()
    serializer_class = StockRequestSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]


# Custom actions for approving or rejecting a stock request
class ApproveStockRequest(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request, pk):
        try:
            stock_request = StockRequest.objects.get(pk=pk)
            if stock_request.status != "Pending":
                return Response(
                    {"error": "Request already processed"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            stock_request.status = "Approved"
            stock_request.save()
            return Response({"status": "Request approved"})
        except StockRequest.DoesNotExist:
            return Response(
                {"error": "Stock request not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def get(self, request, pk):
        try:
            stock_request = StockRequest.objects.get(pk=pk)
            return Response({"status": stock_request.status})
        except StockRequest.DoesNotExist:
            return Response(
                {"error": "Stock request not found"}, status=status.HTTP_404_NOT_FOUND
            )


class RejectStockRequest(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request, pk):
        try:
            stock_request = StockRequest.objects.get(pk=pk)
            if stock_request.status != "Pending":
                return Response(
                    {"error": "Request already processed"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            stock_request.status = "Rejected"
            stock_request.save()
            return Response({"status": "Request rejected"})
        except StockRequest.DoesNotExist:
            return Response(
                {"error": "Stock request not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def get(self, request, pk):
        try:
            stock_request = StockRequest.objects.get(pk=pk)
            return Response({"status": stock_request.status})
        except StockRequest.DoesNotExist:
            return Response(
                {"error": "Stock request not found"}, status=status.HTTP_404_NOT_FOUND
            )
