import '../../domain/entities/review.dart';

class ReviewModel extends Review {
  ReviewModel({
    required super.id,
    required super.productId,
    required super.userId,
    required super.userName,
    required super.userEmail,
    super.title,
    required super.rating,
    required super.comment,
    required super.isPurchased,
    required super.createdAt,
    required super.updatedAt,
  });

  factory ReviewModel.fromJson(Map<String, dynamic> json) {
    return ReviewModel(
      id: json['id'] as String? ?? '',
      productId: json['product'] as String? ?? '',
      userId: json['user'] as String? ?? '',
      userName: json['user_name'] as String? ?? '',
      userEmail: json['user_email'] as String? ?? '',
      title: json['title'] as String?,
      rating: json['rating'] as int? ?? 0,
      comment: json['comment'] as String? ?? '',
      isPurchased: json['is_purchased'] as bool? ?? false,
      createdAt:
          json['created_at'] != null
              ? DateTime.parse(json['created_at'].toString())
              : DateTime.now(),
      updatedAt:
          json['updated_at'] != null
              ? DateTime.parse(json['updated_at'].toString())
              : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'product': productId,
      'user': userId,
      'user_name': userName,
      'user_email': userEmail,
      'title': title,
      'rating': rating,
      'comment': comment,
      'is_purchased': isPurchased,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }
}

class ReviewSummaryModel extends ReviewSummary {
  ReviewSummaryModel({
    required super.totalReviews,
    required super.averageRating,
    required super.ratingDistribution,
  });

  factory ReviewSummaryModel.fromJson(Map<String, dynamic> json) {
    final ratingDistribution = <int, int>{};
    if (json['rating_distribution'] is Map<String, dynamic>) {
      final distribution = json['rating_distribution'] as Map<String, dynamic>;
      distribution.forEach((key, value) {
        final rating = int.tryParse(key);
        if (rating != null) {
          ratingDistribution[rating] = value as int? ?? 0;
        }
      });
    }

    return ReviewSummaryModel(
      totalReviews: json['total_reviews'] as int? ?? 0,
      averageRating: (json['average_rating'] as num?)?.toDouble() ?? 0.0,
      ratingDistribution: ratingDistribution,
    );
  }

  Map<String, dynamic> toJson() {
    final distributionMap = <String, int>{};
    ratingDistribution.forEach((key, value) {
      distributionMap[key.toString()] = value;
    });

    return {
      'total_reviews': totalReviews,
      'average_rating': averageRating,
      'rating_distribution': distributionMap,
    };
  }
}
