import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/review.dart';
import '../repositories/review_repository.dart';

class CreateReview {
  final ReviewRepository repository;

  CreateReview(this.repository);

  Future<Either<Failure, Review>> call({
    required String productId,
    required int rating,
    required String comment,
    String? title,
  }) async {
    return await repository.createReview(
      productId: productId,
      rating: rating,
      comment: comment,
      title: title,
    );
  }
}
