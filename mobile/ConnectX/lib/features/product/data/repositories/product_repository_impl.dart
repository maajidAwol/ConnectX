import 'package:dartz/dartz.dart';
import 'package:korecha/features/product/domain/entities/category.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/network/network_info.dart';
import '../../domain/entities/product.dart';
import '../../domain/repositories/product_repository.dart';
import '../datasources/product_remote_data_source.dart';

class ProductRepositoryImpl implements ProductRepository {
  final ProductRemoteDataSource remoteDataSource;
  final NetworkInfo networkInfo;

  ProductRepositoryImpl({
    required this.remoteDataSource,
    required this.networkInfo,
  });

  @override
  Future<Either<Failure, List<Product>>> getProducts({
    int page = 1,
    int pageSize = 20,
  }) async {
    print('getProducts');
    if (await networkInfo.isConnected) {
      try {
        final products = await remoteDataSource.getProducts(
          page: page,
          pageSize: pageSize,
        );

        return Right(products);
      } catch (e) {
        // print(e);
        return Left(ServerFailure(message: e.toString()));
      }
    } else {
      // print('getProducts else');
      return Left(NetworkFailure());
    }
  }

  @override
  Future<Either<Failure, List<Product>>> getAllProductsAcrossPages({
    int maxPages = 3,
  }) async {
    if (await networkInfo.isConnected) {
      try {
        final products = await remoteDataSource.getAllProductsAcrossPages(
          maxPages: maxPages,
        );
        return Right(products);
      } catch (e) {
        return Left(ServerFailure(message: e.toString()));
      }
    } else {
      return Left(NetworkFailure());
    }
  }

  @override
  Future<Either<Failure, List<Product>>> getProductBySearch(
    String query,
  ) async {
    if (await networkInfo.isConnected) {
      try {
        final products = await remoteDataSource.getProductBySearch(query);
        return Right(products);
      } catch (e) {
        return Left(ServerFailure(message: e.toString()));
      }
    } else {
      return Left(NetworkFailure());
    }
  }

  @override
  Future<Either<Failure, Product>> getProductById(String productId) async {
    if (await networkInfo.isConnected) {
      try {
        final product = await remoteDataSource.getProductById(productId);
        return Right(product);
      } catch (e) {
        return Left(ServerFailure(message: e.toString()));
      }
    } else {
      return Left(NetworkFailure());
    }
  }

  @override
  Future<Either<Failure, List<Category>>> getProductCategories() async {
    if (await networkInfo.isConnected) {
      try {
        final categories = await remoteDataSource.getProductCategories();
        return Right(categories);
      } catch (e) {
        return Left(ServerFailure(message: e.toString()));
      }
    } else {
      return Left(NetworkFailure());
    }
  }

  @override
  Future<Either<Failure, List<Product>>> getProductsByCategoryId(
    String categoryId,
  ) async {
    if (await networkInfo.isConnected) {
      try {
        final products = await remoteDataSource.getProductsByCategoryId(
          categoryId,
        );
        return Right(products);
      } catch (e) {
        return Left(ServerFailure(message: e.toString()));
      }
    } else {
      return Left(NetworkFailure());
    }
  }
}
