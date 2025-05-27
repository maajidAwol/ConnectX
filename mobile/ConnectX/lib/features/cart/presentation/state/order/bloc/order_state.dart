part of 'order_bloc.dart';

sealed class OrderState extends Equatable {
  const OrderState();

  @override
  List<Object?> get props => [];
}

final class OrderInitial extends OrderState {}

final class OrderLoading extends OrderState {}

final class OrderFailure extends OrderState {
  final String message;
  const OrderFailure(this.message);

  @override
  List<Object> get props => [message];
}

final class OrderLoaded extends OrderState {
  final MyOrdersModel myOrders;
  const OrderLoaded(this.myOrders);

  @override
  List<Object> get props => [myOrders];
}

final class OrderDetailsLoading extends OrderState {
  final MyOrdersModel? existingOrders; // Preserve existing orders
  const OrderDetailsLoading({this.existingOrders});

  @override
  List<Object?> get props => [existingOrders];
}

final class OrderDetailsLoaded extends OrderState {
  final OrderDetailsModel orderDetails;
  final MyOrdersModel? existingOrders; // Preserve existing orders
  const OrderDetailsLoaded(this.orderDetails, {this.existingOrders});

  @override
  List<Object?> get props => [orderDetails, existingOrders];
}

final class OrderDetailsFailure extends OrderState {
  final String message;
  final MyOrdersModel? existingOrders; // Preserve existing orders
  const OrderDetailsFailure(this.message, {this.existingOrders});

  @override
  List<Object?> get props => [message, existingOrders];
}

final class ChapaOrderCreated extends OrderState {}

final class CashOnDeliveryOrderCreated extends OrderState {}
