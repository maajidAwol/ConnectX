import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:korecha/components/skleton/product/products_skelton.dart';
import 'package:korecha/features/product/domain/usecases/get_filtered_products.dart';
import 'package:korecha/features/product/presentation/state/home/bloc/home_bloc.dart';
import 'package:korecha/route/route_constants.dart';

import '/components/Banner/M/banner_m_with_counter.dart';
import '../../../../../components/product/product_card.dart';
import '../../../../../constants.dart';

class FlashSale extends StatelessWidget {
  const FlashSale({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // While loading show 👇
        // const BannerMWithCounterSkelton(),
        BannerMWithCounter(
          duration: const Duration(hours: 8),
          text: "Super Flash Sale \n50% Off",
          press: () {},
        ),
        const SizedBox(height: defaultPadding / 2),
        Padding(
          padding: const EdgeInsets.all(defaultPadding),
          child: Text(
            "Countdown Products",
            style: Theme.of(context).textTheme.titleSmall,
          ),
        ),
        // While loading show 👇
        // const ProductsSkelton(),
        SizedBox(
          height: 220,
          child: BlocBuilder<HomeBloc, HomeState>(
            
            builder: (context, state) {
              if (state is HomeLoading) {
                return const ProductsSkelton();
              } else if (state is HomeLoaded) {
                final products = state.products[ProductFilter.countDownProducts] ?? [];
                if (products.isEmpty) {
                  return const Center(child: Text('No products available'));
                }
                return ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: state.products.length,
                  itemBuilder: (context, index) => Padding(
                    padding: EdgeInsets.only(
                      left: defaultPadding,
                      right: index == state.products.length - 1
                          ? defaultPadding
                          : 0,
                    ),
                    child: ProductCard(
                        image: products[index].coverUrl,
                        brandName: products[index].name,
                      title: products[index].subDescription,
                      price: products[index].priceSale != null && products[index].priceSale! > products[index].price ? products[index].priceSale! : products[index].price,
                      priceAfetDiscount: products[index].price,
                      dicountpercent: products[index].priceSale != null && products[index].priceSale! > products[index].price
                          ? ((products[index].price -
                                  products[index].priceSale!) /
                              products[index].price *
                              100)
                              .round()
                          : null,
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
