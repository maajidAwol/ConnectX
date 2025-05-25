class Review {
  final String id;
  final String productId;
  final String userId;
  final String userName;
  final String userEmail;
  final String? title;
  final int rating;
  final String comment;
  final bool isPurchased;
  final DateTime createdAt;
  final DateTime updatedAt;

  Review({
    required this.id,
    required this.productId,
    required this.userId,
    required this.userName,
    required this.userEmail,
    this.title,
    required this.rating,
    required this.comment,
    required this.isPurchased,
    required this.createdAt,
    required this.updatedAt,
  });
}

class ReviewSummary {
  final int totalReviews;
  final double averageRating;
  final Map<int, int> ratingDistribution;

  ReviewSummary({
    required this.totalReviews,
    required this.averageRating,
    required this.ratingDistribution,
  });

  int get fiveStarCount => ratingDistribution[5] ?? 0;
  int get fourStarCount => ratingDistribution[4] ?? 0;
  int get threeStarCount => ratingDistribution[3] ?? 0;
  int get twoStarCount => ratingDistribution[2] ?? 0;
  int get oneStarCount => ratingDistribution[1] ?? 0;
}
