import 'package:flutter/material.dart';
import 'package:korecha/features/product/domain/entities/category.dart';
import 'package:korecha/features/product/presentation/state/home/bloc/home_bloc.dart';
import 'package:korecha/features/product/presentation/state/product/bloc/product_bloc.dart';
import 'package:korecha/route/screen_export.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'categories_shimmer.dart';

import '../../../../../constants.dart';

// For preview
class CategoryModel {
  final String name;
  final String? svgSrc, route;

  CategoryModel({required this.name, this.svgSrc, this.route});
}

// export const PRODUCT_CATEGORY_GROUP_OPTIONS = [
//   { group: 'Clothing', classify: ['Shirts', 'T-shirts', 'Jeans', 'Leather', 'Accessories'] },
//   { group: 'Tailored', classify: ['Suits', 'Blazers', 'Trousers', 'Waistcoats', 'Apparel'] },
//   { group: 'Accessories', classify: ['Shoes', 'Backpacks and bags', 'Bracelets', 'Face masks'] },
// ];
// List<CategoryModel> demoCategories = [
//   CategoryModel(name: "All Categories"),
//   // CategoryModel(
//   //     name: "On Sale",
//   //     svgSrc: "assets/icons/Sale.svg",
//   //     route: onSaleScreenRoute),
//   // CategoryModel(name: "Clothing", svgSrc: "assets/icons/Man.svg"),
//   // CategoryModel(name: "Woman's", svgSrc: "assets/icons/Woman.svg"),
//   CategoryModel(
//       name: "Kids", svgSrc: "assets/icons/Child.svg", route: kidsScreenRoute),
//   CategoryModel(name: "Shirts", route: categoryScreenRoute),
//   CategoryModel(name: "T-shirts", route: categoryScreenRoute),
//   CategoryModel(name: "Jeans", route: categoryScreenRoute),
//   CategoryModel(name: "Leather", route: categoryScreenRoute),
//   CategoryModel(name: "Accessories", route: categoryScreenRoute),
//   CategoryModel(name: "Shoes", route: categoryScreenRoute),
//   CategoryModel(name: "Backpacks and bags", route: categoryScreenRoute),
//   CategoryModel(name: "Bracelets", route: categoryScreenRoute),
//   CategoryModel(name: "Face masks", route: categoryScreenRoute),
//   CategoryModel(name: "Suits", route: categoryScreenRoute),
//   CategoryModel(name: "Blazers", route: categoryScreenRoute),
//   CategoryModel(name: "Trousers", route: categoryScreenRoute),
//   CategoryModel(name: "Waistcoats", route: categoryScreenRoute),
//   CategoryModel(name: "Apparel", route: categoryScreenRoute),
// ];
// End For Preview

class Categories extends StatelessWidget {
  const Categories({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<HomeBloc, HomeState>(
      builder: (context, state) {
        if (state is HomeLoading) {
          return const CategoriesShimmer();
        }
        if (state is HomeError) {
          return Center(child: Text(state.message));
        }
        if (state is HomeLoaded) {
          final categories = [
            Category(
              name: "All",
              coverImg: null,
              id: '0',
              slug: 'all',
              group: 'All',
              description: 'All',
              isActive: true,
              createdAt: DateTime.now(),
              updatedAt: DateTime.now(),
            ),
            ...state.categories,
          ];

          return SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                ...List.generate(
                  categories.length,
                  (index) => Padding(
                    padding: EdgeInsets.only(
                      left: index == 0 ? defaultPadding : defaultPadding / 2,
                      right:
                          index == categories.length - 1 ? defaultPadding : 0,
                    ),
                    child: CategoryBtn(
                      category: categories[index].name,
                      svgSrc: categories[index].coverImg,
                      isActive: index == 0,
                      press: () {
                        if (index != 0) {
                          context.read<ProductBloc>().add(
                            LoadProductsByCategoryId(
                              categories[index].id.toString(),
                            ),
                          );
                          Navigator.pushNamed(context, categoryScreenRoute,
                              arguments: {
                                'title': categories[index].name,
                              });
                        }
                      },
                    ),
                  ),
                ),
              ],
            ),
          );
        }
        return const SizedBox.shrink();
      },
    );
  }
}

class CategoryBtn extends StatelessWidget {
  const CategoryBtn({
    super.key,
    required this.category,
    this.svgSrc,
    required this.isActive,
    required this.press,
  });

  final String category;
  final String? svgSrc;
  final bool isActive;
  final VoidCallback press;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: press,
      borderRadius: const BorderRadius.all(Radius.circular(30)),
      child: Container(
        height: 36,
        padding: const EdgeInsets.symmetric(horizontal: defaultPadding),
        decoration: BoxDecoration(
          color: isActive ? primaryColor : Colors.transparent,
          border: Border.all(
            color:
                isActive ? Colors.transparent : Theme.of(context).dividerColor,
          ),
          borderRadius: const BorderRadius.all(Radius.circular(30)),
        ),
        child: Row(
          children: [
            if (svgSrc != null)
              Image.network(
                svgSrc!,
                height: 20,
                color:
                    isActive
                        ? Colors.white
                        : Theme.of(context).iconTheme.color!,
              ),
            if (svgSrc != null) const SizedBox(width: defaultPadding / 2),
            Text(
              category,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color:
                    isActive
                        ? Colors.white
                        : Theme.of(context).textTheme.bodyLarge!.color,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
