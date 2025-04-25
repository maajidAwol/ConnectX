part of 'order_bloc.dart';

sealed class OrderState extends Equatable {
  const OrderState();

  @override
  List<Object> get props => [];
}

final class OrderInitial extends OrderState {}

final class OrderLoading extends OrderState {}

final class OrderFailure extends OrderState {
  final String message;
  const OrderFailure(this.message);
}

final class OrderLoaded extends OrderState {
  final MyOrdersModel myOrders;
  const OrderLoaded(this.myOrders);
}

final class ChapaOrderCreated extends OrderState {}

final class CashOnDeliveryOrderCreated extends OrderState {}
