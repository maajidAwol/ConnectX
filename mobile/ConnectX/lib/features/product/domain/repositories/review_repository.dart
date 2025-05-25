import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/review.dart';

abstract class ReviewRepository {
  Future<Either<Failure, Review>> createReview({
    required String productId,
    required int rating,
    required String comment,
    String? title,
  });

  Future<Either<Failure, List<Review>>> getProductReviews(String productId);
}
