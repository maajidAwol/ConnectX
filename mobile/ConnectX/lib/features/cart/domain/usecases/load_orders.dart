// import 'package:dartz/dartz.dart';
// import 'package:shop/core/error/failures.dart';
// import 'package:shop/core/usecases/usecase.dart';
//   import 'package:shop/features/cart/domain/entities/cart_item.dart';
// import 'package:shop/features/cart/domain/entities/order.dart';
// import 'package:shop/features/cart/domain/repositories/cart_repository.dart';
// import 'package:shop/features/cart/domain/repositories/order_repository.dart';
// import 'package:shop/features/cart/presentation/pages/orders_screen.dart';

// class LoadOrdersUseCase implements UseCase<List<Order_Model>, NoParams> {
//   final OrderRepository repository;

//   LoadOrdersUseCase({required this.repository});

//   @override
//   Future<Either<Failure, List<Order_Model>>> call(NoParams params) async {
//     return await repository.getOrders();
//   }
// }
