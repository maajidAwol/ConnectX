import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:korecha/features/cart/data/models/chapa_order_request_model.dart';
import 'package:korecha/features/cart/data/models/cod_order_request_model.dart';
import 'package:korecha/features/cart/data/models/my_orders_model.dart';
import 'package:korecha/features/cart/data/models/order_details_model.dart';
import 'package:korecha/features/cart/domain/usecases/create_chapa_order.dart';
import 'package:korecha/features/cart/domain/usecases/create_cod_order.dart';
import 'package:korecha/features/cart/domain/usecases/get_orders.dart';
import 'package:korecha/features/cart/domain/usecases/get_order_details.dart';

part 'order_event.dart';
part 'order_state.dart';

class OrderBloc extends Bloc<OrderEvent, OrderState> {
  final CreateChapaOrderUseCase createChapaOrderUseCase;
  final CreateCodOrderUseCase createCashOnDeliveryOrderUseCase;
  final GetOrdersUseCase getOrdersUseCase;
  final GetOrderDetailsUseCase getOrderDetailsUseCase;

  OrderBloc({
    required this.createChapaOrderUseCase,
    required this.createCashOnDeliveryOrderUseCase,
    required this.getOrdersUseCase,
    required this.getOrderDetailsUseCase,
  }) : super(OrderInitial()) {
    on<CreateChapaOrderEvent>(_onCreateChapaOrder);
    on<CreateCashOnDeliveryOrderEvent>(_onCreateCashOnDeliveryOrder);
    on<LoadOrders>(_onLoadOrders);
    on<LoadOrderDetails>(_onLoadOrderDetails);
  }

  Future<void> _onCreateChapaOrder(
    CreateChapaOrderEvent event,
    Emitter<OrderState> emit,
  ) async {
    emit(OrderLoading());

    final result = await createChapaOrderUseCase(event.order);

    result.fold(
      (failure) => emit(OrderFailure(failure.toString())),
      (_) => emit(ChapaOrderCreated()),
    );
  }

  Future<void> _onCreateCashOnDeliveryOrder(
    CreateCashOnDeliveryOrderEvent event,
    Emitter<OrderState> emit,
  ) async {
    emit(OrderLoading());

    final result = await createCashOnDeliveryOrderUseCase(event.order);

    result.fold(
      (failure) => emit(OrderFailure(failure.toString())),
      (_) => emit(CashOnDeliveryOrderCreated()),
    );
  }

  Future<void> _onLoadOrders(LoadOrders event, Emitter<OrderState> emit) async {
    emit(OrderLoading());

    final result = await getOrdersUseCase(null);

    result.fold((failure) => emit(OrderFailure(failure.toString())), (
      orderData,
    ) {
      // Convert the raw API data to Order_Model objects
      final MyOrdersModel myOrders = orderData;
      print(myOrders);

      emit(OrderLoaded(myOrders));
    });
  }

  Future<void> _onLoadOrderDetails(
    LoadOrderDetails event,
    Emitter<OrderState> emit,
  ) async {
    // Preserve existing orders if available
    MyOrdersModel? existingOrders;
    if (state is OrderLoaded) {
      existingOrders = (state as OrderLoaded).myOrders;
    } else if (state is OrderDetailsLoaded) {
      existingOrders = (state as OrderDetailsLoaded).existingOrders;
    } else if (state is OrderDetailsFailure) {
      existingOrders = (state as OrderDetailsFailure).existingOrders;
    }

    emit(OrderDetailsLoading(existingOrders: existingOrders));

    final result = await getOrderDetailsUseCase(event.orderId);

    result.fold(
      (failure) => emit(
        OrderDetailsFailure(failure.toString(), existingOrders: existingOrders),
      ),
      (orderDetails) {
        emit(OrderDetailsLoaded(orderDetails, existingOrders: existingOrders));
      },
    );
  }
}
