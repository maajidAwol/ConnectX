import 'package:dartz/dartz.dart';
import 'package:korecha/core/error/failures.dart';
import 'package:korecha/core/usecases/usecase.dart';
import 'package:korecha/features/cart/data/models/cod_order_request_model.dart';
import 'package:korecha/features/cart/domain/repositories/order_repository.dart';

class CreateCodOrderUseCase implements UseCase<void, CashOnDeliveryOrder> {
  final OrderRepository repository;

  CreateCodOrderUseCase({required this.repository});

  @override
  Future<Either<Failure, void>> call(CashOnDeliveryOrder order) async {
    return await repository.createCashOnDeliveryOrder(
      order: order,

    );
  }
}

