// import 'package:flutter/material.dart';
// import 'package:flutter_bloc/flutter_bloc.dart';
// import '../../state/product/bloc/product_bloc.dart';
// import '../../../domain/usecases/get_products_by_category.dart';
// import 'product_card.dart';

// class FilteredProductsView extends StatefulWidget {
//   const FilteredProductsView({super.key});

//   @override
//   State<FilteredProductsView> createState() => _FilteredProductsViewState();
// }

// class _FilteredProductsViewState extends State<FilteredProductsView>
//     with SingleTickerProviderStateMixin {
//   late TabController _tabController;

//   final List<Map<String, dynamic>> tabs = [
//     {
//       'value': ProductCategory.featured,
//       'label': 'Featured Products',
//       'icon': Icons.star,
//     },
//     {
//       'value': ProductCategory.topRated,
//       'label': 'Top Rated Products',
//       'icon': Icons.stars,
//     },
//     {
//       'value': ProductCategory.onSale,
//       'label': 'On Sale Products',
//       'icon': Icons.local_offer,
//     },
//   ];

//   @override
//   void initState() {
//     super.initState();
//     _tabController = TabController(length: tabs.length, vsync: this);
//     // Load initial products
//     context
//         .read<ProductBloc>()
//         .add(LoadProductsByCategoryId(tabs[0]['value']));
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Column(
//       children: [
//         TabBar(
//           controller: _tabController,
//           onTap: (index) {
//             context.read<ProductBloc>().add(
//                   LoadProductsByCategoryId(tabs[index]['value']),
//                 );
//           },
//           tabs: tabs
//               .map((tab) => Tab(
//                     icon: Icon(tab['icon']),
//                     text: tab['label'],
//                   ))
//               .toList(),
//         ),
//         Expanded(
//           child: BlocBuilder<ProductBloc, ProductState>(
//             builder: (context, state) {
//               if (state is ProductLoading) {
//                 return const Center(child: CircularProgressIndicator());
//               } else if (state is ProductLoaded) {
//                 return GridView.builder(
//                   padding: const EdgeInsets.all(16),
//                   gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
//                     crossAxisCount: 2,
//                     childAspectRatio: 0.7,
//                     crossAxisSpacing: 16,
//                     mainAxisSpacing: 16,
//                   ),
//                   itemCount: state.products.length,
//                   itemBuilder: (context, index) {
//                     return ProductCard(product: state.products[index]);
//                   },
//                 );
//               } else if (state is ProductError) {
//                 return Center(child: Text(state.message));
//               }
//               return const SizedBox();
//             },
//           ),
//         ),
//       ],
//     );
//   }

//   @override
//   void dispose() {
//     _tabController.dispose();
//     super.dispose();
//   }
// }
