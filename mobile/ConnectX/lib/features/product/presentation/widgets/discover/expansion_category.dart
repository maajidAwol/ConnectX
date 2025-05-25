import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:korecha/components/network_image_with_loader.dart';
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

  final String title, svgSrc;
  final List<Category> subCategory;

  @override
  Widget build(BuildContext context) {
    return ExpansionTile(
      iconColor: Theme.of(context).textTheme.bodyLarge!.color,
      collapsedIconColor: Theme.of(context).textTheme.bodyMedium!.color,
      leading: SizedBox(
        height: 24,
        width: 24,
        child: NetworkImageWithLoader(svgSrc, fit: BoxFit.contain, radius: 0),
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
                  subCategory[index].coverImg != null
                      ? SizedBox(
                        height: 24,
                        width: 24,
                        child: NetworkImageWithLoader(
                          subCategory[index].coverImg!,
                          fit: BoxFit.contain,
                          radius: 0,
                        ),
                      )
                      : const SizedBox(
                        width: 24,
                        height: 24,
                      ), // Maintain space if no image
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
