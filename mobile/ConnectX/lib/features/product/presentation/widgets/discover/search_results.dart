import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/svg.dart';
import 'package:korecha/components/product/product_card.dart';
import 'package:korecha/features/product/presentation/state/discover/bloc/discover_bloc.dart';
import 'package:korecha/features/product/presentation/state/product/bloc/product_bloc.dart';
import 'package:korecha/route/route_constants.dart';
import 'package:korecha/utils/price_utils.dart';

import '../../../../../../constants.dart';

class SearchResultsScreen extends StatelessWidget {
  const SearchResultsScreen({super.key});
  // final String category;
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<DiscoverBloc, DiscoverState>(
      builder: (context, state) {
        if (state is DiscoverLoading) {
          return const Center(child: CircularProgressIndicator());
        }

        if (state is DiscoverProductsLoaded) {
          if (state.products.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.search_off_outlined,
                    size: 64,
                    color: Colors.grey[400],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'No products found',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 24),
                  _buildExploreButton(context),
                ],
              ),
            );
          }

          return Column(
            children: [
              Container(
                padding: const EdgeInsets.only(
                  left: defaultPadding,
                  right: defaultPadding,
                  bottom: 8,
                ),
                decoration: BoxDecoration(
                  color: Theme.of(context).scaffoldBackgroundColor,
                  // boxShadow: [
                  //   BoxShadow(
                  //     color: Colors.black.withOpacity(0.05),
                  //     blurRadius: 8,
                  //     offset: const Offset(0, 2),
                  //   ),
                  // ],
                ),
                child: Row(
                  children: [
                    Text(
                      '${state.products.length} results found',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                    const Spacer(),
                    _buildExploreButton(context),
                  ],
                ),
              ),
              Expanded(
                child: CustomScrollView(
                  slivers: [
                    SliverPadding(
                      padding: const EdgeInsets.all(defaultPadding),
                      sliver: SliverGrid(
                        gridDelegate:
                            const SliverGridDelegateWithMaxCrossAxisExtent(
                              maxCrossAxisExtent: 200.0,
                              mainAxisSpacing: defaultPadding,
                              crossAxisSpacing: defaultPadding,
                              childAspectRatio: 0.66,
                            ),
                        delegate: SliverChildBuilderDelegate((context, index) {
                          final product = state.products[index];
                          return ProductCard(
                            image: product.coverUrl,
                            brandName: product.name,
                            title: product.subDescription,
                            price: product.price,
                            priceAfetDiscount: product.priceSale,
                            dicountpercent:
                                PriceUtils.calculateDiscountPercentage(
                                  product.price,
                                  product.priceSale,
                                ),
                            press: () {
                              Navigator.pushNamed(
                                context,
                                productDetailsScreenRoute,
                                arguments: {
                                  'isProductAvailable': true,
                                  'productId': product.id,
                                },
                              );
                            },
                          );
                        }, childCount: state.products.length),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          );
        }

        return const SizedBox.shrink();
      },
    );
  }

  Widget _buildExploreButton(BuildContext context) {
    return TextButton.icon(
      onPressed: () {
        context.read<DiscoverBloc>().add(LoadDiscoverCategories());
      },
      icon: const Icon(Icons.category_outlined),
      label: const Text('Browse Categories'),
      style: TextButton.styleFrom(
        foregroundColor: Theme.of(context).primaryColor,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
          side: BorderSide(color: Theme.of(context).primaryColor),
        ),
      ),
    );
  }
}
