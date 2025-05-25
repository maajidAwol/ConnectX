import 'package:dartz/dartz.dart';
import 'package:korecha/features/product/domain/entities/category.dart';
import '../entities/product.dart';
import '../../../../core/error/failures.dart';

abstract class ProductRepository {
  Future<Either<Failure, List<Product>>> getProducts({
    int page = 1,
    int pageSize = 20,
  });
  Future<Either<Failure, Product>> getProductById(String productId);
  Future<Either<Failure, List<Category>>> getProductCategories();
  Future<Either<Failure, List<Product>>> getProductsByCategoryId(
    String categoryId,
  );
  Future<Either<Failure, List<Product>>> getProductBySearch(String query);
  Future<Either<Failure, List<Product>>> getAllProductsAcrossPages({
    int maxPages = 3,
  });
}
