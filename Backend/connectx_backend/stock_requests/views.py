from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated,AllowAny 
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from .models import StockRequest
from .serializers import StockRequestSerializer
from .permissions import IsAdminOrEntrepreneur, IsOwnerOrAdmin, IsAdmin
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from connectx_backend.authentication import IsAuthenticatedWithCustomToken
class StockRequestList2(APIView):
    # permission_classes = [IsAuthenticated]
    # permission_classes = [IsAuthenticatedWithCustomToken]

    
    def get(self, request, *args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return Response({"error": "Authorization header missing"}, status=400)

        if not auth_header.startswith('Bearer '):
            return Response({"error": "Invalid Authorization header format"}, status=400)

        token = auth_header.split(' ')[1]
        jwt_auth = JWTAuthentication()

        try:
            validated_token = jwt_auth.get_validated_token(token)
            user = jwt_auth.get_user(validated_token)
            return Response({"message": "Token is valid", "user": user.email})
        except Exception as e:
            return Response({"error": str(e)}, status=401)
class StockRequestList(generics.ListAPIView):
    queryset = StockRequest.objects.all()
    serializer_class = StockRequestSerializer
    permission_classes = [IsAuthenticatedWithCustomToken, IsAdminOrEntrepreneur]

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
