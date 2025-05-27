import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:korecha/components/product/product_card.dart';
import 'package:korecha/components/skleton/product/products_skelton.dart';
import 'package:korecha/features/product/domain/usecases/get_filtered_products.dart';
import 'package:korecha/features/product/presentation/state/home/bloc/home_bloc.dart';
import 'package:korecha/utils/price_utils.dart';

import '../../../../../constants.dart';
import '../../../../../route/route_constants.dart';

class BestSellers extends StatelessWidget {
  const BestSellers({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: defaultPadding / 2),
        Padding(
          padding: const EdgeInsets.all(defaultPadding),
          child: Text(
            "Hot Deals",
            style: Theme.of(context).textTheme.titleSmall,
          ),
        ),
        // While loading use 👇
        // const ProductsSkelton(),
        SizedBox(
          height: 220,
          child: BlocBuilder<HomeBloc, HomeState>(
            builder: (context, state) {
              if (state is HomeLoading) {
                return const ProductsSkelton();
              } else if (state is HomeLoaded) {
                final products = state.products[ProductFilter.hotDeals] ?? [];
                if (products.isEmpty) {
                  return const Center(child: Text('No products available'));
                }
                return ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: products.length,
                  itemBuilder:
                      (context, index) => Padding(
                        padding: EdgeInsets.only(
                          left: defaultPadding,
                          right:
                              index == products.length - 1 ? defaultPadding : 0,
                        ),
                        child: ProductCard(
                          image: products[index].coverUrl,
                          brandName: products[index].name,
                          title: products[index].subDescription,
                          price: products[index].price,
                          priceAfetDiscount: products[index].priceSale,
                          dicountpercent:
                              PriceUtils.calculateDiscountPercentage(
                                products[index].price,
                                products[index].priceSale,
                              ),
                          press: () {
                            Navigator.pushNamed(
                              context,
                              productDetailsScreenRoute,
                              arguments: {
                                'isProductAvailable': true,
                                'productId': products[index].id,
                              },
                            );
                          },
                        ),
                      ),
                );
              } else if (state is HomeError) {
                return Center(child: Text(state.message));
              }
              return const SizedBox();
            },
          ),
        ),
      ],
    );
  }
}
