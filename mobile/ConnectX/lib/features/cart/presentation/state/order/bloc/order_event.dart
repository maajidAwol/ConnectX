part of 'order_bloc.dart';

sealed class OrderEvent extends Equatable {
  const OrderEvent();

  @override
  List<Object> get props => [];
}

final class CreateChapaOrderEvent extends OrderEvent {
  final ChapaOrderModel order;
  const CreateChapaOrderEvent(this.order);
}

final class CreateCashOnDeliveryOrderEvent extends OrderEvent {
  final CashOnDeliveryOrder order;
  const CreateCashOnDeliveryOrderEvent(this.order);
}

final class LoadOrders extends OrderEvent {
  const LoadOrders();
}

final class LoadOrderDetails extends OrderEvent {
  final String orderId;
  const LoadOrderDetails(this.orderId);
}
