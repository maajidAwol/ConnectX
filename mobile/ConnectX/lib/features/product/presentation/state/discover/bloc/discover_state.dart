part of 'discover_bloc.dart';

sealed class DiscoverState extends Equatable {
  const DiscoverState();
  
  @override
  List<Object> get props => [];
}

final class DiscoverInitial extends DiscoverState {}

final class DiscoverLoading extends DiscoverState {}

final class DiscoverCategoriesLoaded extends DiscoverState {
  final List<Category> categories;

  const DiscoverCategoriesLoaded({required this.categories});

 
}

final class DiscoverCategoriesError extends DiscoverState {
  final String message;

  const DiscoverCategoriesError({required this.message});
}

final class DiscoverProductsLoaded extends DiscoverState {
  final List<Product> products;

  const DiscoverProductsLoaded({required this.products});
} 

final class DiscoverProductsError extends DiscoverState {
  final String message;

  const DiscoverProductsError({required this.message});
}


