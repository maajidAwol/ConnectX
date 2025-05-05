import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/cart_item.dart';

abstract class CartRepository {
  Future<Either<Failure, List<CartItem>>> getCartItems();
  Future<Either<Failure, void>> addCartItem(CartItem item);
  Future<Either<Failure, void>> updateCartItem(CartItem item);
  Future<Either<Failure, void>> removeCartItem(String id);
  Future<Either<Failure, void>> clearCart();
}
