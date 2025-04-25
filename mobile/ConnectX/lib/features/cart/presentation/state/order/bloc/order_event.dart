part of 'order_bloc.dart';

sealed class OrderEvent extends Equatable {
  const OrderEvent();

  @override
  List<Object> get props => [];
}

class CreateChapaOrder extends OrderEvent {
  final ChapaOrderModel order;

  const CreateChapaOrder(this.order);
}

class CreateCashOnDeliveryOrder extends OrderEvent {
  final CashOnDeliveryOrder order;

  const CreateCashOnDeliveryOrder(this.order);
}

class LoadOrders extends OrderEvent {
  const LoadOrders();
}
