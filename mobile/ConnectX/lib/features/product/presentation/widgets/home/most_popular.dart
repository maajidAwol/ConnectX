import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:korecha/components/product/secondary_product_card.dart';
import 'package:korecha/components/skleton/product/secondary_product_skelton.dart';
import 'package:korecha/features/product/domain/usecases/get_filtered_products.dart';
import 'package:korecha/features/product/presentation/state/home/bloc/home_bloc.dart';
import '../../../../../constants.dart';
import '../../../../../route/route_constants.dart';

class MostPopular extends StatelessWidget {
  const MostPopular({super.key});

  // @override
  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: defaultPadding / 2),
        Padding(
          padding: const EdgeInsets.all(defaultPadding),
          child: Text(
            "Most popular",
            style: Theme.of(context).textTheme.titleSmall,
          ),
        ),
        SizedBox(
          height: 114,
          child: BlocBuilder<HomeBloc, HomeState>(
            builder: (context, state) {
              // print(state.products ?? "no products");
              if (state is HomeLoading) {
                return const Center(child: SeconderyProductSkelton());
              } else if (state is HomeLoaded) {
                final products =
                    state.products[ProductFilter.popularProducts] ?? [];
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
                        child: SecondaryProductCard(
                          // image: state.products[index].coverUrl,
                          image: products[index].coverUrl,
                          brandName: products[index].name,
                          title: products[index].subDescription,
                          price:
                              products[index].priceSale != null &&
                                      products[index].priceSale! >
                                          products[index].price
                                  ? products[index].priceSale!
                                  : products[index].price,
                          priceAfetDiscount: products[index].price,
                          dicountpercent:
                              products[index].priceSale != null &&
                                      products[index].priceSale! >
                                          products[index].price
                                  ? ((products[index].price -
                                              products[index].priceSale!) /
                                          products[index].price *
                                          100)
                                      .round()
                                  : null,
                          press: () {
                            // Navigator.pushNamed(
                            //   context,
                            //   productDetailsScreenRoute,
                            //   arguments: state.products[index].id,
                            // );
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
