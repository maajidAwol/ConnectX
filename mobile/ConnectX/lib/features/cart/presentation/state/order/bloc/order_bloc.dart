import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:korecha/features/cart/data/models/chapa_order_request_model.dart';
import 'package:korecha/features/cart/data/models/cod_order_request_model.dart';
import 'package:korecha/features/cart/data/models/my_orders_model.dart';
import 'package:korecha/features/cart/domain/usecases/create_chapa_order.dart';
import 'package:korecha/features/cart/domain/usecases/create_cod_order.dart';
import 'package:korecha/features/cart/domain/usecases/get_orders.dart';

part 'order_event.dart';
part 'order_state.dart';

class OrderBloc extends Bloc<OrderEvent, OrderState> {
  final CreateChapaOrderUseCase createChapaOrderUseCase;
  final CreateCodOrderUseCase createCashOnDeliveryOrderUseCase;
  final GetOrdersUseCase getOrdersUseCase;

  OrderBloc({
    required this.createChapaOrderUseCase,
    required this.createCashOnDeliveryOrderUseCase,
    required this.getOrdersUseCase,
  }) : super(OrderInitial()) {
    on<CreateChapaOrder>(_onCreateChapaOrder);
    on<CreateCashOnDeliveryOrder>(_onCreateCashOnDeliveryOrder);
    on<LoadOrders>(_onLoadOrders);
  }

  Future<void> _onCreateChapaOrder(
      CreateChapaOrder event, Emitter<OrderState> emit) async {
    emit(OrderLoading());
    final order = event.order;
    final result = await createChapaOrderUseCase(order);
    result.fold(
      (failure) => emit(OrderFailure(failure.toString())),
      (success) => emit(ChapaOrderCreated()),
    );
  }

  Future<void> _onCreateCashOnDeliveryOrder(
      CreateCashOnDeliveryOrder event, Emitter<OrderState> emit) async {
    emit(OrderLoading());
    final order = event.order;
    final result = await createCashOnDeliveryOrderUseCase(order);
    result.fold(
      (failure) => emit(OrderFailure(failure.toString())),
      (success) => emit(CashOnDeliveryOrderCreated()),
    );
  }

  Future<void> _onLoadOrders(LoadOrders event, Emitter<OrderState> emit) async {
    emit(OrderLoading());

    final result = await getOrdersUseCase(null);

    result.fold(
      (failure) => emit(OrderFailure(failure.toString())),
      (orderData) {
        // Convert the raw API data to Order_Model objects
        final MyOrdersModel myOrders = orderData;
        print(myOrders);

        emit(OrderLoaded(myOrders));
      },
    );
  }
}
