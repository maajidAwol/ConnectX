import 'package:dartz/dartz.dart';
import 'package:korecha/core/error/failures.dart';
import 'package:korecha/features/cart/data/models/cod_order_request_model.dart';
import 'package:korecha/features/cart/data/models/cod_order_response.dart';
import 'package:korecha/features/cart/data/models/my_orders_model.dart';
import '../../data/models/chapa_order_request_model.dart';
import '../../data/models/chapa_order_response_model.dart';
import '../../data/models/order_details_model.dart';

abstract class OrderRepository {
  /// Creates an order with Chapa payment method
  Future<Either<Failure, ChapaOrderResponse>> createChapaOrder({
    required ChapaOrderModel order,
  });

  /// Creates an order with Cash on Delivery payment method
  Future<Either<Failure, CashOnDeliveryResponse>> createCashOnDeliveryOrder({
    required CashOnDeliveryOrder order,
  });

  /// Gets all orders for the current user
  Future<Either<Failure, MyOrdersModel>> getOrders();

  /// Gets detailed order information by ID
  Future<Either<Failure, OrderDetailsModel>> getOrderDetails({
    required String orderId,
  });
}
