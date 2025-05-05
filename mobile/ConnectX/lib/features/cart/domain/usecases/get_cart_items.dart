import 'package:dartz/dartz.dart';
import 'package:korecha/core/error/failures.dart';
import 'package:korecha/core/usecases/usecase.dart';
import 'package:korecha/features/cart/domain/entities/cart_item.dart';
import 'package:korecha/features/cart/domain/repositories/cart_repository.dart';

class GetCartItemsUseCase implements UseCase<List<CartItem>, NoParams> {
  final CartRepository repository;

  GetCartItemsUseCase({required this.repository});

  @override
  Future<Either<Failure, List<CartItem>>> call(void params) async {
    return await repository.getCartItems();
  }
}
