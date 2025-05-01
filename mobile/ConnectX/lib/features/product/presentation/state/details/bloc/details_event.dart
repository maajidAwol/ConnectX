part of 'details_bloc.dart';

@immutable
sealed class DetailsEvent {}

class LoadProductDetails extends DetailsEvent {
  final String productId;
  LoadProductDetails({required this.productId});
}
