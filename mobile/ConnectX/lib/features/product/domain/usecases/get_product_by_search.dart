import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/product.dart';
import '../repositories/product_repository.dart';




class GetProductBySearchUseCase implements UseCase<List<Product>, String> {
  final ProductRepository repository;

  GetProductBySearchUseCase({required this.repository});

  @override
  Future<Either<Failure, List<Product>>> call(String params) async {
    return await repository.getProductBySearch(params);
  }
}

