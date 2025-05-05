import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/svg.dart';
import 'package:korecha/components/product/product_card.dart';
import 'package:korecha/features/product/presentation/state/product/bloc/product_bloc.dart';
import 'package:korecha/features/product/presentation/widgets/category/category_screen_shimmer.dart';
import 'package:korecha/route/route_constants.dart';

import '../../../../../../constants.dart';

class CategoryScreen extends StatelessWidget {
  final String title;
  const CategoryScreen({super.key, required this.title});
  // final String category;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        surfaceTintColor: Theme.of(context).scaffoldBackgroundColor,
        // pinned: true,
        // floating: true,
        // snap: true,
        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
        // leading: const SizedBox(),
        // leadingWidth: 0,
        centerTitle: false,
        title: Text(title, style: Theme.of(context).textTheme.titleLarge),
        actions: [
          IconButton(
            onPressed: () {
              // Navigator.pushNamed(context, searchScreenRoute);
              Navigator.pushNamedAndRemoveUntil(
                context,
                entryPointScreenRoute,
                (route) => false,
                arguments: 1,
              );
            },
            icon: SvgPicture.asset(
              "assets/icons/Search.svg",
              height: 24,
              colorFilter: ColorFilter.mode(
                Theme.of(context).textTheme.bodyLarge!.color!,
                BlendMode.srcIn,
              ),
            ),
          ),
          // IconButton(
          //   onPressed: () {
          //     Navigator.pushNamed(context, notificationsScreenRoute);
          //   },
          //   icon: SvgPicture.asset(
          //     "assets/icons/Stores.svg",
          //     height: 24,
          //     colorFilter: ColorFilter.mode(
          //       Theme.of(context).textTheme.bodyLarge!.color!,
          //       BlendMode.srcIn,
          //     ),
          //   ),
          // ),
        ],
      ),
      body: BlocBuilder<ProductBloc, ProductState>(
        builder: (context, state) {
          if (state is ProductLoading) {
            return const CategoryScreenShimmer();
          }
          if (state is ProductError) {
            return const Center(child: Text("Error"));
          }
          if (state is ProductByCategoryIdLoaded) {
            if (state.products.isEmpty) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.inventory_2_outlined,
                      size: 120,
                      color: Theme.of(
                        context,
                      ).textTheme.bodyLarge!.color!.withOpacity(0.3),
                    ),
                    const SizedBox(height: defaultPadding),
                    Text(
                      "No products available",
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: Theme.of(
                          context,
                        ).textTheme.bodyLarge!.color!.withOpacity(0.6),
                      ),
                    ),
                  ],
                ),
              );
            }
            return CustomScrollView(
              slivers: [
                // While loading use 👇
                //  BookMarksSlelton(),
                SliverPadding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: defaultPadding,
                    vertical: defaultPadding,
                  ),
                  sliver: SliverGrid(
                    gridDelegate:
                        const SliverGridDelegateWithMaxCrossAxisExtent(
                          maxCrossAxisExtent: 200.0,
                          mainAxisSpacing: defaultPadding,
                          crossAxisSpacing: defaultPadding,
                          childAspectRatio: 0.66,
                        ),
                    delegate: SliverChildBuilderDelegate((
                      BuildContext context,
                      int index,
                    ) {
                      return ProductCard(
                        image: state.products[index].coverUrl,
                        brandName: state.products[index].name,
                        title: state.products[index].subDescription,
                        price: state.products[index].price,
                        priceAfetDiscount: state.products[index].priceSale,
                        dicountpercent: 10,
                        press: () {
                          // Navigator.pushNamed(
                          //     context, productDetailsScreenRoute);
                          Navigator.pushNamed(
                            context,
                            productDetailsScreenRoute,
                            arguments: {
                              'isProductAvailable': true,
                              'productId': state.products[index].id,
                            },
                          );
                        },
                      );
                    }, childCount: state.products.length),
                  ),
                ),
              ],
            );
          }
          return const SizedBox.shrink();
        },
      ),
    );
  }
}
