part of 'home_bloc.dart';

@immutable
sealed class HomeEvent {}

// class LoadProducts extends HomeEvent {}



class LoadProductsByFilter extends HomeEvent {
  LoadProductsByFilter();
}

class LoadProductCategories extends HomeEvent {
  LoadProductCategories();
}
