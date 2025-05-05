import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import 'package:korecha/constants.dart';

class CategoryScreenShimmer extends StatelessWidget {
  const CategoryScreenShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverPadding(
          padding: const EdgeInsets.symmetric(
            horizontal: defaultPadding,
            vertical: defaultPadding,
          ),
          sliver: SliverGrid(
            gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
              maxCrossAxisExtent: 200.0,
              mainAxisSpacing: defaultPadding,
              crossAxisSpacing: defaultPadding,
              childAspectRatio: 0.66,
            ),
            delegate: SliverChildBuilderDelegate(
              (BuildContext context, int index) {
                return _buildProductCardShimmer(context);
              },
              childCount: 6, // Show 6 shimmer items
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildProductCardShimmer(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: Colors.grey[300]!,
      highlightColor: Colors.grey[100]!,
      child: Container(
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey[200]!),
          borderRadius: BorderRadius.circular(defaultBorderRadious),
        ),
        child: Column(
          children: [
            // Image placeholder
            AspectRatio(
              aspectRatio: 1.15,
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(defaultBorderRadious),
                ),
              ),
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Brand name placeholder
                    Container(width: 60, height: 10, color: Colors.white),
                    const SizedBox(height: defaultPadding / 2),
                    // Title placeholder (2 lines)
                    Container(
                      width: double.infinity,
                      height: 12,
                      color: Colors.white,
                    ),
                    const SizedBox(height: 4),
                    Container(width: 100, height: 12, color: Colors.white),
                    const Spacer(),
                    // Price placeholder
                    Container(width: 80, height: 12, color: Colors.white),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
