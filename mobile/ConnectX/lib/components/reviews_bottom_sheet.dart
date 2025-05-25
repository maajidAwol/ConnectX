import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:timeago/timeago.dart' as timeago;
import '../constants.dart';
import '../features/product/domain/entities/review.dart' as review_entities;

class ReviewsBottomSheet extends StatelessWidget {
  final List<review_entities.Review> reviews;
  final String productId;
  final VoidCallback? onWriteReview;

  const ReviewsBottomSheet({
    super.key,
    required this.reviews,
    required this.productId,
    this.onWriteReview,
  });

  static void show(
    BuildContext context, {
    required List<review_entities.Review> reviews,
    required String productId,
    VoidCallback? onWriteReview,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder:
          (context) => ReviewsBottomSheet(
            reviews: reviews,
            productId: productId,
            onWriteReview: onWriteReview,
          ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.8,
      decoration: BoxDecoration(
        color: Theme.of(context).scaffoldBackgroundColor,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(20),
          topRight: Radius.circular(20),
        ),
      ),
      child: Column(
        children: [
          // Handle bar
          Container(
            margin: const EdgeInsets.only(top: 8),
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Theme.of(context).dividerColor.withOpacity(0.5),
              borderRadius: BorderRadius.circular(2),
            ),
          ),

          // Header
          Padding(
            padding: const EdgeInsets.all(defaultPadding),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    'Reviews (${reviews.length})',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                if (onWriteReview != null)
                  TextButton.icon(
                    onPressed: () {
                      Navigator.pop(context);
                      onWriteReview?.call();
                    },
                    icon: Icon(
                      Icons.edit,
                      size: 18,
                      color: Theme.of(context).primaryColor,
                    ),
                    label: Text(
                      'Write Review',
                      style: TextStyle(
                        color: Theme.of(context).primaryColor,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
              ],
            ),
          ),

          const Divider(height: 1),

          // Reviews list
          Expanded(
            child:
                reviews.isEmpty
                    ? _buildEmptyState(context)
                    : ListView.builder(
                      padding: const EdgeInsets.all(defaultPadding),
                      itemCount: reviews.length,
                      itemBuilder: (context, index) {
                        final review = reviews[index];
                        return Padding(
                          padding: EdgeInsets.only(
                            bottom:
                                index == reviews.length - 1
                                    ? 0
                                    : defaultPadding,
                          ),
                          child: _ReviewItem(review: review),
                        );
                      },
                    ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.rate_review_outlined,
            size: 64,
            color: Theme.of(context).dividerColor,
          ),
          const SizedBox(height: defaultPadding),
          Text(
            'No reviews yet',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
              color: Theme.of(context).textTheme.bodyMedium?.color,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Be the first to review this product',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: Theme.of(context).textTheme.bodySmall?.color,
            ),
          ),
          if (onWriteReview != null) ...[
            const SizedBox(height: defaultPadding),
            ElevatedButton.icon(
              onPressed: () {
                Navigator.pop(context);
                onWriteReview?.call();
              },
              icon: const Icon(Icons.edit, size: 18),
              label: const Text('Write Review'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).primaryColor,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(defaultBorderRadious),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _ReviewItem extends StatelessWidget {
  final review_entities.Review review;

  const _ReviewItem({required this.review});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(defaultPadding),
      decoration: BoxDecoration(
        color: Theme.of(context).primaryColor.withOpacity(0.05),
        borderRadius: BorderRadius.circular(defaultBorderRadious),
        border: Border.all(
          color: Theme.of(context).primaryColor.withOpacity(0.2),
          width: 0.5,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // User info and rating
          Row(
            children: [
              // User avatar
              CircleAvatar(
                radius: 20,
                backgroundColor: Theme.of(
                  context,
                ).primaryColor.withOpacity(0.1),
                child: Text(
                  _getInitials(review.userName),
                  style: TextStyle(
                    color: Theme.of(context).primaryColor,
                    fontWeight: FontWeight.w600,
                    fontSize: 14,
                  ),
                ),
              ),
              const SizedBox(width: 12),

              // User name and date
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      review.userName,
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Text(
                      timeago.format(review.createdAt),
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Theme.of(
                          context,
                        ).textTheme.bodySmall?.color?.withOpacity(0.7),
                      ),
                    ),
                  ],
                ),
              ),

              // Rating stars and verified badge column
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  // Rating stars
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      RatingBarIndicator(
                        rating: review.rating.toDouble(),
                        itemBuilder:
                            (context, index) =>
                                const Icon(Icons.star, color: Colors.amber),
                        itemCount: 5,
                        itemSize: 16,
                        unratedColor: Theme.of(
                          context,
                        ).dividerColor.withOpacity(0.3),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        review.rating.toString(),
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: Colors.amber[700],
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),

                  // Verified purchase badge below stars
                  if (review.isPurchased) ...[
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: successColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: successColor.withOpacity(0.3),
                          width: 1,
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.verified_outlined,
                            size: 12,
                            color: successColor,
                          ),
                          const SizedBox(width: 3),
                          Text(
                            'Verified',
                            style: Theme.of(
                              context,
                            ).textTheme.bodySmall?.copyWith(
                              color: successColor,
                              fontWeight: FontWeight.w500,
                              fontSize: 10,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
            ],
          ),

          const SizedBox(height: 12),

          // Review title (if available)
          if (review.title != null && review.title!.isNotEmpty) ...[
            Text(
              review.title!,
              style: Theme.of(
                context,
              ).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 8),
          ],

          // Review comment
          Text(review.comment, style: Theme.of(context).textTheme.bodyMedium),
        ],
      ),
    );
  }

  String _getInitials(String name) {
    return name.isNotEmpty
        ? name.trim().split(' ').map((l) => l[0]).take(2).join().toUpperCase()
        : 'U';
  }
}
