import 'package:dartz/dartz.dart';
import 'package:korecha/core/error/failures.dart';
import 'package:korecha/core/network/network_info.dart';
import 'package:korecha/features/cart/data/models/cod_order_request_model.dart';
import 'package:korecha/features/cart/data/models/cod_order_response.dart';
import 'package:korecha/features/cart/data/models/my_orders_model.dart';
import '../datasources/order_remote_datasource.dart';
import '../models/chapa_order_request_model.dart';
import '../models/chapa_order_response_model.dart';
import '../../domain/repositories/order_repository.dart';

class OrderRepositoryImpl implements OrderRepository {
  final OrderRemoteDataSource remoteDataSource;
  final NetworkInfo networkInfo;

  OrderRepositoryImpl({
    required this.remoteDataSource,
    required this.networkInfo,
  });

  @override
  Future<Either<Failure, CashOnDeliveryResponse>> createCashOnDeliveryOrder(
      {required CashOnDeliveryOrder order}) async {
    final result = await remoteDataSource.createCashOnDeliveryOrder(order);
    // TODO: implement createCashOnDeliveryOrder
    try {
      return right(result);
    } catch (e) {
      return left(ServerFailure());
    }
  }

  @override
  Future<Either<Failure, ChapaOrderResponse>> createChapaOrder(
      {required ChapaOrderModel order}) async {
    final result = await remoteDataSource.createChapaOrder(order);
    try {
      return right(result);
    } catch (e) {
      return left(ServerFailure());
    }
    // TODO: implement createChapaOrder
  }

  @override
  Future<Either<Failure, MyOrdersModel>> getOrders() async {
    // TODO: implement getUserOrders
    final result = await remoteDataSource.getOrders();
    print(result);
    try {
      return right(result);
    } catch (e) {
      return left(ServerFailure());
    }
  }
}
