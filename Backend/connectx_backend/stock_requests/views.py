from rest_framework import generics, status
# from rest_framework.permissions import IsAuthenticated
from connectx_backend.authentication import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from .models import StockRequest
from .serializers import StockRequestSerializer
from .permissions import IsAdminOrEntrepreneur, IsOwnerOrAdmin, IsAdmin

# Views for StockRequest


class StockRequestList(generics.ListAPIView):
    queryset = StockRequest.objects.all()
    serializer_class = StockRequestSerializer
    permission_classes = [IsAuthenticated, IsAdminOrEntrepreneur]

    def get_queryset(self):
        """
        Filter stock requests based on user role.
        Entrepreneurs see only their requests, Admins see all requests.
        """
        user = self.request.user
        if user.role == "entrepreneur":
            return StockRequest.objects.filter(entrepreneur=user)
        return StockRequest.objects.all()



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
