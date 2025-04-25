import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:korecha/features/cart/domain/usecases/add_to_cart.dart';
import 'package:korecha/features/cart/domain/usecases/get_cart_items.dart';
import '../../../../domain/entities/cart_item.dart';
import '../../../../domain/repositories/cart_repository.dart';
part 'cart_state.dart';
part 'cart_event.dart';

// States

// Bloc
class CartBloc extends Bloc<CartEvent, CartState> {
  final CartRepository repository;
  final AddToCartUseCase addToCartUseCase;
  final GetCartItemsUseCase getCartItemsUseCase;

  CartBloc({
    required this.addToCartUseCase,
    required this.getCartItemsUseCase,
    required this.repository,
  }) : super(CartInitial()) {
    on<LoadCart>(_onLoadCart);
    on<AddToCart>(_onAddToCart);
    on<UpdateCartItem>(_onUpdateCartItem);
    on<RemoveFromCart>(_onRemoveFromCart);
    on<ClearCart>(_onClearCart);
  }

  void _onLoadCart(LoadCart event, Emitter<CartState> emit) async {
    emit(CartLoading());
    final result = await getCartItemsUseCase(null);
    result.fold(
      (failure) => emit(CartError(failure.toString())),
      (items) => emit(CartLoaded(items)),
    );
  }

  Future<void> _onAddToCart(AddToCart event, Emitter<CartState> emit) async {
    try {
      emit(CartLoading());

      // Add item to cart
      final addResult = await addToCartUseCase(event.item);
      final addSuccess = await addResult.fold(
        (failure) async {
          emit(CartError(failure.toString()));
          return false;
        },
        (_) async => true,
      );

      if (!addSuccess) return;

      // Get updated cart items
      final cartItemsResult = await getCartItemsUseCase(null);
      await cartItemsResult.fold(
        (failure) async => emit(CartError(failure.toString())),
        (items) async => emit(CartLoaded(items)),
      );
    } catch (e) {
      emit(CartError('An error occurred while managing cart'));
    }
  }

  Future<void> _onUpdateCartItem(
      UpdateCartItem event, Emitter<CartState> emit) async {
    try {
      final currentState = state;
      if (currentState is! CartLoaded) return;

      emit(CartLoading());

      // Update the cart item with the provided quantity
      final updateResult = await repository.updateCartItem(event.item);
      final updateSuccess = await updateResult.fold(
        (failure) async {
          emit(CartError('Failed to update cart item'));
          return false;
        },
        (_) async => true,
      );

      if (!updateSuccess) return;

      // Get updated cart items
      final cartItemsResult = await repository.getCartItems();
      await cartItemsResult.fold(
        (failure) async => emit(CartError('Failed to update cart')),
        (items) async => emit(CartLoaded(items)),
      );
    } catch (e) {
      emit(CartError('An error occurred while managing cart'));
    }
  }

  Future<void> _onRemoveFromCart(
      RemoveFromCart event, Emitter<CartState> emit) async {
    try {
      final currentState = state;
      if (currentState is! CartLoaded) return;

      emit(CartLoading());

      // Remove the cart item
      final removeResult = await repository.removeCartItem(event.id);
      final removeSuccess = await removeResult.fold(
        (failure) async {
          emit(CartError('Failed to remove item from cart'));
          return false;
        },
        (_) async => true,
      );

      if (!removeSuccess) return;

      // Get updated cart items
      final cartItemsResult = await repository.getCartItems();
      await cartItemsResult.fold(
        (failure) async => emit(CartError('Failed to update cart')),
        (items) async => emit(CartLoaded(items)),
      );
    } catch (e) {
      emit(CartError('An error occurred while managing cart'));
    }
  }

  Future<void> _onClearCart(ClearCart event, Emitter<CartState> emit) async {
    try {
      emit(CartLoading());

      final result = await repository.clearCart();
      await result.fold(
        (failure) async => emit(CartError('Failed to clear cart')),
        (_) async => emit(CartLoaded([])),
      );
    } catch (e) {
      emit(CartError('An error occurred while clearing cart'));
    }
  }
}
