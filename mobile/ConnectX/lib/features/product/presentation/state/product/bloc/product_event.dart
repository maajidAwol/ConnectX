part of 'product_bloc.dart';

abstract class AuthEvent {}

abstract class ProductEvent {}

class LoadProducts extends ProductEvent {}

class FilterProductsByCategory extends ProductEvent {
  final String category;
  FilterProductsByCategory(this.category);
}

class LoadProductsByCategoryId extends ProductEvent {
  final String categoryId;
  LoadProductsByCategoryId(this.categoryId);
}

class LoadProductById extends ProductEvent {
  final String productId;
  LoadProductById(this.productId);
}
