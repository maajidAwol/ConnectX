part of 'details_bloc.dart';

@immutable
sealed class DetailsState {}

final class DetailsInitial extends DetailsState {}

final class DetailsLoading extends DetailsState {}

final class DetailsLoaded extends DetailsState {
  final Product product;
  DetailsLoaded({required this.product});
}

final class DetailsError extends DetailsState {
  final String message;
  DetailsError({required this.message});
}
