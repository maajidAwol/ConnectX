import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/product.dart';
import '../repositories/product_repository.dart';

class FetchAllProducts implements UseCase<List<Product>, NoParams> {
  final ProductRepository repository;

  FetchAllProducts(this.repository);

  @override
  Future<Either<Failure, List<Product>>> call(void params) async {
    return await repository.getProducts();
  }
}
  
