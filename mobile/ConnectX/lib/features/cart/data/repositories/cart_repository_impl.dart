import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../domain/entities/cart_item.dart';
import '../../domain/repositories/cart_repository.dart';
import '../datasources/cart_local_data_source.dart';
import '../models/cart_item_model.dart';

class CartRepositoryImpl implements CartRepository {
  final CartLocalDataSource localDataSource;

  CartRepositoryImpl({required this.localDataSource});

  @override
  Future<Either<Failure, List<CartItem>>> getCartItems() async {
    try {
      final cartItems = await localDataSource.getCartItems();
      return Right(cartItems);
    } catch (e) {
      return Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, void>> addCartItem(CartItem item) async {
    try {
      final cartItemModel = CartItemModel(
        id: item.id,
        productId: item.productId,
        name: item.name,
        price: item.price,
        coverUrl: item.coverUrl,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        address: item.address,
      );
      await localDataSource.addCartItem(cartItemModel);
      return const Right(null);
    } catch (e) {
      return Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, void>> updateCartItem(CartItem item) async {
    try {
      final cartItemModel = CartItemModel(
        id: item.id,
        productId: item.productId,
        name: item.name,
        price: item.price,
        coverUrl: item.coverUrl,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        address: item.address,
      );
      await localDataSource.updateCartItem(cartItemModel);
      return const Right(null);
    } catch (e) {
      return Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, void>> removeCartItem(String id) async {
    try {
      await localDataSource.removeCartItem(id);
      return const Right(null);
    } catch (e) {
      return Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, void>> clearCart() async {
    try {
      await localDataSource.clearCart();
      return const Right(null);
    } catch (e) {
      return Left(CacheFailure());
    }
  }
}
