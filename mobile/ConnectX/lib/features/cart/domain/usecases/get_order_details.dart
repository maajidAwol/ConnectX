import 'package:dartz/dartz.dart';
import 'package:korecha/core/error/failures.dart';
import 'package:korecha/core/usecases/usecase.dart';
import 'package:korecha/features/cart/domain/repositories/order_repository.dart';
import 'package:korecha/features/cart/data/models/order_details_model.dart';

/// Fetches detailed order information by ID
class GetOrderDetailsUseCase implements UseCase<OrderDetailsModel, String> {
  final OrderRepository repository;

  GetOrderDetailsUseCase(this.repository);

  @override
  Future<Either<Failure, OrderDetailsModel>> call(String orderId) async {
    return await repository.getOrderDetails(orderId: orderId);
  }
}
