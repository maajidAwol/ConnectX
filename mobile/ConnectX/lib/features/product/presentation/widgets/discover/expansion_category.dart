import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:korecha/features/product/presentation/state/product/bloc/product_bloc.dart';
import 'package:korecha/route/screen_export.dart';
import 'package:korecha/features/product/domain/entities/category.dart';

import '../../../../../constants.dart';

class ExpansionCategory extends StatelessWidget {
  const ExpansionCategory({
    super.key,
    required this.title,
    required this.subCategory,
    required this.svgSrc,
  });

  final String title;
  final String? svgSrc;
  final List<Category> subCategory;

  // Get a random icon when icon is null
  IconData getRandomIcon() {
    final List<IconData> icons = [
      Icons.category,
      Icons.shopping_bag,
      Icons.store,
      Icons.inventory_2,
      Icons.local_mall,
      Icons.format_paint,
      Icons.home,
      Icons.devices,
      Icons.chair,
      Icons.fitness_center,
    ];

    final random = Random();
    return icons[random.nextInt(icons.length)];
  }

  @override
  Widget build(BuildContext context) {
    return ExpansionTile(
      iconColor: Theme.of(context).textTheme.bodyLarge!.color,
      collapsedIconColor: Theme.of(context).textTheme.bodyMedium!.color,
      leading:
          svgSrc == null
              ? Icon(
                getRandomIcon(),
                size: 24,
                color: Theme.of(context).iconTheme.color,
              )
              : Image.network(
                svgSrc!,
                height: 24,
                width: 24,
                errorBuilder: (context, error, stackTrace) {
                  return Icon(
                    getRandomIcon(),
                    size: 24,
                    color: Theme.of(context).iconTheme.color,
                  );
                },
              ),
      title: Text(title, style: const TextStyle(fontSize: 14)),
      textColor: Theme.of(context).textTheme.bodyLarge!.color,
      childrenPadding: const EdgeInsets.only(left: defaultPadding * 3.5),
      children: List.generate(
        subCategory.length,
        (index) => Column(
          children: [
            ListTile(
              leading:
                  subCategory[index].coverImg == null
                      ? Icon(
                        getRandomIcon(),
                        size: 24,
                        color: Theme.of(context).iconTheme.color,
                      )
                      : Image.network(
                        subCategory[index].coverImg!,
                        height: 24,
                        width: 24,
                        errorBuilder: (context, error, stackTrace) {
                          return Icon(
                            getRandomIcon(),
                            size: 24,
                            color: Theme.of(context).iconTheme.color,
                          );
                        },
                      ),
              onTap: () {
                context.read<ProductBloc>().add(
                  LoadProductsByCategoryId(subCategory[index].id.toString()),
                );
                Navigator.pushNamed(
                  context,
                  categoryScreenRoute,
                  arguments: {'title': subCategory[index].name},
                );
              },
              title: Text(
                subCategory[index].name,
                style: const TextStyle(fontSize: 14),
              ),
            ),
            if (index < subCategory.length - 1) const Divider(height: 1),
          ],
        ),
      ),
    );
  }
}
