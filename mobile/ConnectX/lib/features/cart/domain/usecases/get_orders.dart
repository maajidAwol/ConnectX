import 'package:dartz/dartz.dart';
import 'package:korecha/core/error/failures.dart';
import 'package:korecha/core/usecases/usecase.dart';
import 'package:korecha/features/cart/domain/repositories/order_repository.dart';
import 'package:korecha/features/cart/data/models/my_orders_model.dart';

/// Fetches all orders for the current user
class GetOrdersUseCase implements UseCase<MyOrdersModel, void> {
  final OrderRepository repository;

  GetOrdersUseCase(this.repository);

  @override
  Future<Either<Failure, MyOrdersModel>> call(void params) async {
    return await repository.getOrders();
  }
}
