// import 'package:flutter/material.dart';
// import 'package:flutter_bloc/flutter_bloc.dart';
// import 'package:shop/components/product/product_card.dart';
// import '../../../../components/product/secondary_product_card.dart';
// import '../../../../constants.dart';
// import '../../../../route/route_constants.dart';
// import '../bloc/product_bloc.dart';

// class PopularProducts extends StatelessWidget {
//   const PopularProducts({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return Column(
//       crossAxisAlignment: CrossAxisAlignment.start,
//       children: [
//         const SizedBox(height: defaultPadding / 2),
//         Padding(
//           padding: const EdgeInsets.all(defaultPadding),
//           child: Text(
//             "Popular Products",
//             style: Theme.of(context).textTheme.titleSmall,
//           ),
//         ),
//         SizedBox(
//           height: 114,
//           child: BlocBuilder<ProductBloc, ProductState>(
//             builder: (context, state) {
//               print("Popular products state: $state");
//               if (state is ProductLoading) {
//                 return const Center(child: CircularProgressIndicator());
//               } else if (state is ProductLoaded) {
//                 print("Popular products: ${state.products}");
//                 if (state.products.isEmpty) {
//                   return const Center(child: Text('No products available'));
//                 }
//                 return ListView.builder(
//                   scrollDirection: Axis.horizontal,
//                   itemCount: state.products.length,
//                   itemBuilder: (context, index) => Padding(
//                     padding: EdgeInsets.only(
//                       left: defaultPadding,
//                       right: index == state.products.length - 1
//                           ? defaultPadding
//                           : 0,
//                     ),
//                     child: ProductCard(
//                       image: state.products[index].coverUrl,
//                       brandName: state.products[index].brand.name,
//                       title: state.products[index].name,
//                       price: state.products[index].price,
//                       priceAfetDiscount: state.products[index].priceSale,
//                       dicountpercent: state.products[index].priceSale != null
//                           ? ((state.products[index].price -
//                                       state.products[index].priceSale!) /
//                                   state.products[index].price *
//                                   100)
//                               .round()
//                           : 0,
//                       press: () {
//                         Navigator.pushNamed(
//                           context,
//                           productDetailsScreenRoute,
//                           arguments: state.products[index].id,
//                         );
//                       },
//                     ),
//                   ),
//                 );
//               } else if (state is ProductError) {
//                 return Center(child: Text(state.message));
//               }
//               return const Center(child: Text('No products'));
//             },
//           ),
//         )
//       ],
//     );
//   }
// }

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:korecha/components/product/product_card.dart';
import 'package:korecha/components/skleton/product/products_skelton.dart';
import 'package:korecha/features/product/domain/usecases/get_filtered_products.dart';
import 'package:korecha/features/product/presentation/state/home/bloc/home_bloc.dart';
import 'package:korecha/route/screen_export.dart';
import '../../../../../constants.dart';

class PopularProducts extends StatelessWidget {
  const PopularProducts({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: defaultPadding / 2),
        Padding(
          padding: const EdgeInsets.all(defaultPadding),
          child: Text(
            "Popular products",
            style: Theme.of(context).textTheme.titleSmall,
          ),
        ),
        SizedBox(
          height: 220,
          child: BlocBuilder<HomeBloc, HomeState>(
            
            builder: (context, state) {
              if (state is HomeLoading) {
                return const ProductsSkelton();
              } else if (state is HomeLoaded) {
                final products = state.products[ProductFilter.popularProducts] ?? [];
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
                      price: products[index].priceSale  !=null && products[index].priceSale! > products[index].price ? products[index].priceSale! : products[index].price,
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
        )
      ],
    );
  }
}
