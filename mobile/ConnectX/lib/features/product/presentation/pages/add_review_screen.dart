import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../../../../constants.dart';
import '../../../../core/injection/injection_container.dart';
import '../../../../core/error/exceptions.dart';
import '../../../product/data/datasources/product_remote_data_source.dart';

class AddReviewScreen extends StatefulWidget {
  final String productId;
  final String productName;
  final VoidCallback? onReviewSubmitted;

  const AddReviewScreen({
    super.key,
    required this.productId,
    required this.productName,
    this.onReviewSubmitted,
  });

  @override
  State<AddReviewScreen> createState() => _AddReviewScreenState();
}

class _AddReviewScreenState extends State<AddReviewScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _commentController = TextEditingController();
  double _rating = 5.0;
  bool _isSubmitting = false;

  @override
  void dispose() {
    _titleController.dispose();
    _commentController.dispose();
    super.dispose();
  }

  void _submitReview() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isSubmitting = true;
      });

      try {
        print('=== SUBMITTING REVIEW ===');
        print('Product ID: ${widget.productId}');
        print('Rating: ${_rating.toInt()}');
        print('Title: ${_titleController.text.trim()}');
        print('Comment: ${_commentController.text.trim()}');

        final dataSource = sl<ProductRemoteDataSource>();

        final review = await dataSource.createReview(
          productId: widget.productId,
          rating: _rating.toInt(),
          comment: _commentController.text.trim(),
          title:
              _titleController.text.trim().isNotEmpty
                  ? _titleController.text.trim()
                  : null,
        );

        print('=== REVIEW CREATED SUCCESSFULLY ===');
        print('Review ID: ${review.id}');

        if (mounted) {
          widget.onReviewSubmitted?.call();
          Navigator.pop(context, true);
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: const Row(
                children: [
                  Icon(Icons.check_circle, color: Colors.white),
                  SizedBox(width: 8),
                  Text('Review submitted successfully!'),
                ],
              ),
              backgroundColor: successColor,
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(defaultBorderRadious),
              ),
            ),
          );
        }
      } catch (e) {
        print('=== ERROR SUBMITTING REVIEW ===');
        print('Error: $e');
        print('Error type: ${e.runtimeType}');

        String errorMessage = 'Failed to submit review';

        // Extract the actual error message from ServerException
        if (e is ServerException) {
          errorMessage = e.message ?? 'Failed to submit review';
        } else {
          errorMessage = e.toString();
        }

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Row(
                children: [
                  const Icon(Icons.error, color: Colors.white),
                  const SizedBox(width: 8),
                  Expanded(child: Text(errorMessage)),
                ],
              ),
              backgroundColor: errorColor,
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(defaultBorderRadious),
              ),
              duration: const Duration(
                seconds: 4,
              ), // Longer duration for error messages
            ),
          );
        }
      } finally {
        if (mounted) {
          setState(() {
            _isSubmitting = false;
          });
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Write a Review'),
        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
        surfaceTintColor: Theme.of(context).scaffoldBackgroundColor,
        elevation: 0,
      ),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(defaultPadding),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Product info card - more compact
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Theme.of(context).primaryColor.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(defaultBorderRadious),
                  border: Border.all(
                    color: Theme.of(context).primaryColor.withOpacity(0.2),
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: Theme.of(context).primaryColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Icon(
                        Icons.shopping_bag_outlined,
                        color: Theme.of(context).primaryColor,
                        size: 18,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Product',
                            style: Theme.of(
                              context,
                            ).textTheme.bodySmall?.copyWith(
                              color: Theme.of(context).primaryColor,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          Text(
                            widget.productName,
                            style: Theme.of(context).textTheme.titleSmall
                                ?.copyWith(fontWeight: FontWeight.w600),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: defaultPadding * 1.5),

              // Rating section - more compact
              Text(
                'How would you rate this product?',
                style: Theme.of(
                  context,
                ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600),
              ),
              const SizedBox(height: 12),

              // Rating display - more compact with full width and background
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Theme.of(context).primaryColor.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(defaultBorderRadious),
                  border: Border.all(
                    color: Theme.of(context).primaryColor.withOpacity(0.2),
                  ),
                ),
                child: Column(
                  children: [
                    RatingBar.builder(
                      initialRating: _rating,
                      minRating: 1,
                      direction: Axis.horizontal,
                      allowHalfRating: false,
                      itemCount: 5,
                      itemSize: 28,
                      itemPadding: const EdgeInsets.symmetric(horizontal: 3.0),
                      glowColor: Colors.amber.withOpacity(0.2),
                      unratedColor: Theme.of(
                        context,
                      ).dividerColor.withOpacity(0.3),
                      itemBuilder:
                          (context, _) =>
                              const Icon(Icons.star, color: Colors.amber),
                      onRatingUpdate: (rating) {
                        setState(() {
                          _rating = rating;
                        });
                      },
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '${_rating.toInt()}/5 ${_getRatingText(_rating.toInt())}',
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        color: Colors.amber[700],
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: defaultPadding * 1.5),

              // Title field (optional) - more compact
              Text(
                'Review Title (Optional)',
                style: Theme.of(
                  context,
                ).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _titleController,
                decoration: InputDecoration(
                  hintText: 'Give your review a catchy title',
                  prefixIcon: Icon(
                    Icons.title,
                    color: Theme.of(context).primaryColor.withOpacity(0.7),
                    size: 20,
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(defaultBorderRadious),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(defaultBorderRadious),
                    borderSide: BorderSide(color: primaryColor, width: 2),
                  ),
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 12,
                  ),
                ),
                maxLength: 100,
                textCapitalization: TextCapitalization.words,
              ),
              const SizedBox(height: 12),

              // Comment field - more compact
              Text(
                'Your Review *',
                style: Theme.of(
                  context,
                ).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _commentController,
                decoration: InputDecoration(
                  hintText: 'Share your experience with this product...',
                  prefixIcon: Padding(
                    padding: const EdgeInsets.only(bottom: 60),
                    child: Icon(
                      Icons.rate_review,
                      color: Theme.of(context).primaryColor.withOpacity(0.7),
                      size: 20,
                    ),
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(defaultBorderRadious),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(defaultBorderRadious),
                    borderSide: BorderSide(color: primaryColor, width: 2),
                  ),
                  alignLabelWithHint: true,
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 12,
                  ),
                ),
                maxLines: 4,
                maxLength: 500,
                textCapitalization: TextCapitalization.sentences,
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Please share your thoughts about this product';
                  }
                  if (value.trim().length < 10) {
                    return 'Review must be at least 10 characters long';
                  }
                  return null;
                },
              ),
              const SizedBox(height: defaultPadding * 1.5),

              // Submit button - more compact
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: _isSubmitting ? null : _submitReview,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: primaryColor,
                    foregroundColor: Colors.white,
                    disabledBackgroundColor: primaryColor.withOpacity(0.6),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(defaultBorderRadious),
                    ),
                    elevation: 2,
                  ),
                  child:
                      _isSubmitting
                          ? const SizedBox(
                            height: 18,
                            width: 18,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              valueColor: AlwaysStoppedAnimation<Color>(
                                Colors.white,
                              ),
                            ),
                          )
                          : Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.send, size: 18),
                              const SizedBox(width: 8),
                              Text(
                                'Submit Review',
                                style: Theme.of(
                                  context,
                                ).textTheme.titleSmall?.copyWith(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                ),
              ),
              const SizedBox(height: 12),

              // Helper text - more compact
              Center(
                child: Text(
                  'Your review helps other customers make informed decisions',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: Theme.of(
                      context,
                    ).textTheme.bodySmall?.color?.withOpacity(0.7),
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _getRatingText(int rating) {
    switch (rating) {
      case 1:
        return 'Poor';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Very Good';
      case 5:
        return 'Excellent';
      default:
        return 'Good';
    }
  }
}
