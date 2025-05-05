import 'package:dartz/dartz.dart';
import 'package:korecha/core/error/failures.dart';
import 'package:korecha/core/usecases/usecase.dart';
import 'package:korecha/features/cart/domain/entities/cart_item.dart';
import 'package:korecha/features/cart/domain/repositories/cart_repository.dart';

class AddToCartUseCase implements UseCase<void, CartItem> {
  final CartRepository repository;

  AddToCartUseCase({required this.repository});

  @override
  Future<Either<Failure, void>> call(CartItem item) async {
    return await repository.addCartItem(item);
  }
}

