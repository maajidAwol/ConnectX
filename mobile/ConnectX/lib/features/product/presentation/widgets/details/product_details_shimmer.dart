import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import '../../../../../constants.dart';

class ProductDetailsShimmer extends StatelessWidget {
  const ProductDetailsShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      bottomNavigationBar: _buildBottomBar(),
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            // AppBar
            SliverAppBar(
              backgroundColor: Theme.of(context).scaffoldBackgroundColor,
              floating: false,
              pinned: true,
              elevation: 0,
              actions: [
                Shimmer.fromColors(
                  baseColor: Colors.grey[300]!,
                  highlightColor: Colors.grey[100]!,
                  child: Container(
                    width: 24,
                    height: 24,
                    margin: const EdgeInsets.only(right: defaultPadding),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                ),
              ],
            ),
            // Product Images
            SliverToBoxAdapter(
              child: Shimmer.fromColors(
                baseColor: Colors.grey[300]!,
                highlightColor: Colors.grey[100]!,
                child: Container(
                  height: 300,
                  margin: const EdgeInsets.symmetric(
                    horizontal: defaultPadding,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
            // Product Info
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(defaultPadding),
                child: Shimmer.fromColors(
                  baseColor: Colors.grey[300]!,
                  highlightColor: Colors.grey[100]!,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Brand
                      Container(
                        width: 100,
                        height: 20,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                      const SizedBox(height: defaultPadding / 2),
                      // Title
                      Container(
                        width: double.infinity,
                        height: 24,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                      const SizedBox(height: defaultPadding / 2),
                      // Rating
                      Row(
                        children: [
                          Container(
                            width: 80,
                            height: 16,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(4),
                            ),
                          ),
                          const SizedBox(width: defaultPadding),
                          Container(
                            width: 100,
                            height: 16,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(4),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: defaultPadding),
                      // Description
                      ...List.generate(
                        3,
                        (index) => Container(
                          width: double.infinity,
                          height: 16,
                          margin: const EdgeInsets.only(bottom: 8),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(4),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            // Review Card
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(defaultPadding),
                child: Shimmer.fromColors(
                  baseColor: Colors.grey[300]!,
                  highlightColor: Colors.grey[100]!,
                  child: Container(
                    height: 200,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ),
            ),
            // You may also like section
            SliverToBoxAdapter(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.all(defaultPadding),
                    child: Shimmer.fromColors(
                      baseColor: Colors.grey[300]!,
                      highlightColor: Colors.grey[100]!,
                      child: Container(
                        width: 150,
                        height: 20,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                    ),
                  ),
                  SizedBox(
                    height: 220,
                    child: Shimmer.fromColors(
                      baseColor: Colors.grey[300]!,
                      highlightColor: Colors.grey[100]!,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: 3,
                        itemBuilder:
                            (context, index) => Container(
                              width: 160,
                              margin: EdgeInsets.only(
                                left: defaultPadding,
                                right: index == 2 ? defaultPadding : 0,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SliverToBoxAdapter(child: SizedBox(height: defaultPadding)),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomBar() {
    return Shimmer.fromColors(
      baseColor: Colors.grey[300]!,
      highlightColor: Colors.grey[100]!,
      child: Container(
        height: 80,
        padding: const EdgeInsets.all(defaultPadding),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
          boxShadow: [
            BoxShadow(
              offset: const Offset(0, -1),
              blurRadius: 4,
              color: Colors.black.withOpacity(0.05),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 100,
              height: 40,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            const SizedBox(width: defaultPadding),
            Expanded(
              child: Container(
                height: 40,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
