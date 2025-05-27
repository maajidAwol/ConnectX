import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/review.dart';
import '../repositories/review_repository.dart';

class GetProductReviews {
  final ReviewRepository repository;

  GetProductReviews(this.repository);

  Future<Either<Failure, List<Review>>> call(String productId) async {
    return await repository.getProductReviews(productId);
  }
}
