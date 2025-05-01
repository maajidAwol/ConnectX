import 'package:dartz/dartz.dart';
import 'package:korecha/core/error/failures.dart';
import 'package:korecha/core/usecases/usecase.dart';
import 'package:korecha/features/cart/data/models/chapa_order_request_model.dart';
import 'package:korecha/features/cart/domain/repositories/order_repository.dart';

class CreateChapaOrderUseCase implements UseCase<void, ChapaOrderModel> {
  final OrderRepository repository;

  CreateChapaOrderUseCase({required this.repository});

  @override
  Future<Either<Failure, void>> call(ChapaOrderModel order) async {
    return await repository.createChapaOrder(
      order: order,
    );
  }
}
