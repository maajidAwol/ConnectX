part of 'home_bloc.dart';

@immutable
sealed class HomeState {}

final class HomeInitial extends HomeState {}

final class HomeLoading extends HomeState {

}

final class HomeLoaded extends HomeState {
  final Map<ProductFilter, List<Product>> products;
  final List<Category> categories;
  HomeLoaded(this.products, this.categories);
}

final class HomeError extends HomeState {
  final String message;
  HomeError(this.message);
}
