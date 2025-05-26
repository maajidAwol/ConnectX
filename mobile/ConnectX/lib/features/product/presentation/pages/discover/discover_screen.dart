import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:korecha/components/skleton/others/discover_categories_skelton.dart';
import 'package:korecha/constants.dart';
import 'package:korecha/features/product/presentation/state/discover/bloc/discover_bloc.dart';
import 'package:korecha/features/product/presentation/widgets/discover/search_form.dart';
import 'package:korecha/features/product/presentation/widgets/discover/search_results.dart';
import 'package:korecha/features/product/presentation/widgets/home/product_card.dart';
import 'package:korecha/route/route_constants.dart';
import '../../../../../../features/product/presentation/widgets/discover/expansion_category.dart';

class DiscoverScreen extends StatefulWidget {
  const DiscoverScreen({super.key});

  @override
  State<DiscoverScreen> createState() => _DiscoverScreenState();
}

class _DiscoverScreenState extends State<DiscoverScreen> {
  final TextEditingController searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    context.read<DiscoverBloc>().add(LoadDiscoverCategories());
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<DiscoverBloc, DiscoverState>(
      builder: (context, state) {
        if (state is DiscoverLoading) {
          return const Scaffold(
            body: Center(child: DiscoverCategoriesSkelton()),
          );
        }

        if (state is DiscoverCategoriesError) {
          return Scaffold(body: Center(child: Text(state.message)));
        }

        return Scaffold(
          body: SafeArea(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.all(defaultPadding),
                  child: SearchForm(
                    controller: searchController,
                    onFieldSubmitted: (query) {
                      context.read<DiscoverBloc>().add(
                        SearchProductByQuery(query: searchController.text),
                      );
                    },
                    onSearch: () {
                      context.read<DiscoverBloc>().add(
                        SearchProductByQuery(query: searchController.text),
                      );
                    },
                  ),
                ),
                Expanded(
                  child: Builder(
                    builder: (context) {
                      // Show search results
                      if (state is DiscoverProductsLoaded) {
                        return SearchResultsScreen();
                        // return Column(
                        //   children: [
                        //     // Explore Categories Button
                        //     Padding(
                        //       padding: const EdgeInsets.all(defaultPadding),
                        //       child: ElevatedButton.icon(
                        //         onPressed: () {
                        //           searchController.clear();
                        //           context.read<DiscoverBloc>().add(
                        //             LoadDiscoverCategories(),
                        //           );
                        //         },
                        //         icon: const Icon(Icons.category_outlined),
                        //         label: const Text('Explore Categories'),
                        //         style: ElevatedButton.styleFrom(
                        //           backgroundColor: Theme.of(
                        //             context,
                        //           ).primaryColor.withOpacity(0.1),
                        //           foregroundColor:
                        //               Theme.of(context).primaryColor,
                        //           padding: const EdgeInsets.symmetric(
                        //             horizontal: 16,
                        //             vertical: 12,
                        //           ),
                        //           shape: RoundedRectangleBorder(
                        //             borderRadius: BorderRadius.circular(12),
                        //           ),
                        //         ),
                        //       ),
                        //     ),
                        //     // Search Results Grid
                        //     Expanded(
                        //       child: GridView.builder(
                        //         padding: const EdgeInsets.all(defaultPadding),
                        //         gridDelegate:
                        //             const SliverGridDelegateWithMaxCrossAxisExtent(
                        //               maxCrossAxisExtent: 200.0,
                        //               mainAxisSpacing: defaultPadding,
                        //               crossAxisSpacing: defaultPadding,
                        //               childAspectRatio: 0.66,
                        //             ),
                        //         itemCount: state.products.length,
                        //         itemBuilder: (context, index) {
                        //           final product = state.products[index];
                        //           return ProductCard(

                        //             product: product,
                        //           );
                        //         },
                        //       ),
                        //     ),
                        //   ],
                        // );
                      }

                      // Show categories (initial state or after clicking Explore Categories)
                      if (state is DiscoverCategoriesLoaded) {
                        return Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: defaultPadding,
                                vertical: defaultPadding / 2,
                              ),
                              child: Text(
                                "Categories",
                                style: Theme.of(context).textTheme.titleSmall,
                              ),
                            ),
                            Expanded(
                              child: ListView.builder(
                                itemCount: state.categories.length,
                                itemBuilder:
                                    (context, index) => ExpansionCategory(
                                      svgSrc:
                                          state.categories[index].coverImg ??
                                          '',
                                      title: state.categories[index].name,
                                      subCategory:
                                          state.categories[index].children ??
                                          [],
                                      categoryId: state.categories[index].id,
                                    ),
                              ),
                            ),
                          ],
                        );
                      }

                      return const SizedBox.shrink();
                    },
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
