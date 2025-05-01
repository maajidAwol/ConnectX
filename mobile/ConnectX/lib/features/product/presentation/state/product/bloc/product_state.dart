part of 'product_bloc.dart';

abstract class ProductState {}

class ProductInitial extends ProductState {}
class ProductDetailsInitial extends ProductState {}
class ProductDetailsLoading extends ProductState {}
class ProductDetailsLoaded extends ProductState {
  final Product product;
  ProductDetailsLoaded({required this.product});
}
class ProductDetailsError extends ProductState {
  final String message;
  ProductDetailsError({required this.message});
}

class ProductLoading extends ProductState {}

class ProductLoaded extends ProductState {
  final List<Product> products;
  final List<Product>? hotDeals;
  final List<Product>? countdownProducts;
  final Product? specialOffer;

  ProductLoaded({
    required this.products,
    this.hotDeals,
    this.countdownProducts,
    this.specialOffer,
  });
}

class ProductByCategoryIdLoaded extends ProductState {
  final List<Product> products;
  ProductByCategoryIdLoaded({required this.products});
}

class ProductError extends ProductState {
  final String message;
  ProductError({required this.message});
}
