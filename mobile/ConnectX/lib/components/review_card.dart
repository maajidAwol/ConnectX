import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '../constants.dart';

class ReviewCard extends StatelessWidget {
  const ReviewCard({
    super.key,
    required this.rating,
    required this.numOfReviews,
    this.numOfFiveStar = 0,
    this.numOfFourStar = 0,
    this.numOfThreeStar = 0,
    this.numOfTwoStar = 0,
    this.numOfOneStar = 0,
  });

  final double rating;
  final int numOfReviews;
  final int numOfFiveStar,
      numOfFourStar,
      numOfThreeStar,
      numOfTwoStar,
      numOfOneStar;

  // Helper method to safely calculate percentage
  double _safePercentage(int count, int total) {
    if (total == 0) return 0.0;
    final percentage = count / total;
    if (percentage.isNaN || percentage.isInfinite) return 0.0;
    return percentage.clamp(0.0, 1.0);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(defaultPadding),
      width: double.infinity,
      decoration: BoxDecoration(
        color: Theme.of(context).textTheme.bodyLarge!.color!.withAlpha(9),
        borderRadius: const BorderRadius.all(
          Radius.circular(defaultBorderRadious),
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text.rich(
                  TextSpan(
                    text: "${rating.toStringAsFixed(1)} ",
                    style: Theme.of(context).textTheme.headlineSmall!.copyWith(
                      fontWeight: FontWeight.w500,
                    ),
                    children: [
                      TextSpan(
                        text: "/5",
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                    ],
                  ),
                ),
                Text(
                  "Based on $numOfReviews Review${numOfReviews == 1 ? '' : 's'}",
                ),
                const SizedBox(height: defaultPadding),
                RatingBar.builder(
                  initialRating: rating,
                  itemSize: 20,
                  itemPadding: const EdgeInsets.only(right: defaultPadding / 4),
                  unratedColor: Theme.of(
                    context,
                  ).textTheme.bodyLarge!.color!.withAlpha(20),
                  glow: false,
                  allowHalfRating: true,
                  ignoreGestures: true,
                  onRatingUpdate: (value) {},
                  itemBuilder:
                      (context, index) =>
                          SvgPicture.asset("assets/icons/Star_filled.svg"),
                ),
              ],
            ),
          ),
          const SizedBox(width: defaultPadding),
          Expanded(
            child: Column(
              children: [
                RateBar(
                  star: 5,
                  value: _safePercentage(numOfFiveStar, numOfReviews),
                ),
                RateBar(
                  star: 4,
                  value: _safePercentage(numOfFourStar, numOfReviews),
                ),
                RateBar(
                  star: 3,
                  value: _safePercentage(numOfThreeStar, numOfReviews),
                ),
                RateBar(
                  star: 2,
                  value: _safePercentage(numOfTwoStar, numOfReviews),
                ),
                RateBar(
                  star: 1,
                  value: _safePercentage(numOfOneStar, numOfReviews),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class RateBar extends StatelessWidget {
  const RateBar({super.key, required this.star, required this.value});

  final int star;
  final double value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(bottom: star == 1 ? 0 : defaultPadding / 2),
      child: Row(
        children: [
          SizedBox(
            width: 40,
            child: Text(
              "$star Star",
              style: Theme.of(context).textTheme.labelSmall!.copyWith(
                color: Theme.of(context).textTheme.bodyMedium!.color,
              ),
            ),
          ),
          const SizedBox(width: defaultPadding / 2),
          Expanded(
            child: ClipRRect(
              borderRadius: const BorderRadius.all(
                Radius.circular(defaultBorderRadious),
              ),
              child: LinearProgressIndicator(
                minHeight: 6,
                color: warningColor,
                backgroundColor: Theme.of(
                  context,
                ).textTheme.bodyLarge!.color!.withAlpha(13),
                value: value.clamp(
                  0.0,
                  1.0,
                ), // Ensure value is always between 0 and 1
              ),
            ),
          ),
        ],
      ),
    );
  }
}
