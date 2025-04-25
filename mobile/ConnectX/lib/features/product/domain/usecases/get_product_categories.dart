import 'package:dartz/dartz.dart';
import 'package:korecha/features/product/domain/entities/category.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../repositories/product_repository.dart';

// class FetchProductDetail implements UseCase<Product, String> {
//   final ProductRepository repository;

//   FetchProductDetail(this.repository);

//   @override
//   Future<Either<Failure, Product>> call(String params) async {
//     return await repository.getProductDetail(params);
//   }
// }


class GetProductCategories implements UseCase<List<Category>, NoParams> {
  final ProductRepository repository;

  GetProductCategories(this.repository);

  @override
  Future<Either<Failure, List<Category>>> call(void params) async {
    return await repository.getProductCategories();
  }
}

