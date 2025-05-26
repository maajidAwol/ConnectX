import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/error/exceptions.dart';
import '../../domain/entities/review.dart';
import '../../domain/repositories/review_repository.dart';
import '../datasources/review_remote_data_source.dart';

class ReviewRepositoryImpl implements ReviewRepository {
  final ReviewRemoteDataSource remoteDataSource;

  ReviewRepositoryImpl({required this.remoteDataSource});

  @override
  Future<Either<Failure, Review>> createReview({
    required String productId,
    required int rating,
    required String comment,
    String? title,
  }) async {
    try {
      final review = await remoteDataSource.createReview(
        productId: productId,
        rating: rating,
        comment: comment,
        title: title,
      );
      return Right(review);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<Review>>> getProductReviews(
    String productId,
  ) async {
    try {
      final reviews = await remoteDataSource.getProductReviews(productId);
      return Right(reviews);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}
