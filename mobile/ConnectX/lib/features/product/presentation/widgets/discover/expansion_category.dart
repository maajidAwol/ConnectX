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
    this.categoryId,
  });

  final String title, svgSrc;
  final List<Category> subCategory;
  final String? categoryId;

  Widget _buildCategoryIcon(String? imageUrl) {
    if (imageUrl == null || imageUrl.isEmpty || imageUrl == "icon-url") {
      return Container(
        height: 24,
        width: 24,
        decoration: BoxDecoration(
          color: Colors.grey[200],
          borderRadius: BorderRadius.circular(4),
        ),
        child: Icon(Icons.category_outlined, color: Colors.grey[400], size: 16),
      );
    }

    return SizedBox(
      height: 24,
      width: 24,
      child: NetworkImageWithLoader(imageUrl, fit: BoxFit.contain, radius: 4),
    );
  }

  @override
  Widget build(BuildContext context) {
    // If there are no subcategories, show as a simple ListTile instead of ExpansionTile
    if (subCategory.isEmpty) {
      return ListTile(
        leading: _buildCategoryIcon(svgSrc),
        title: Text(title, style: const TextStyle(fontSize: 14)),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
        onTap: () {
          if (categoryId != null) {
            context.read<ProductBloc>().add(
              LoadProductsByCategoryId(categoryId!),
            );
            Navigator.pushNamed(
              context,
              categoryScreenRoute,
              arguments: {'title': title},
            );
          }
        },
      );
    }

    return ExpansionTile(
      iconColor: Theme.of(context).textTheme.bodyLarge!.color,
      collapsedIconColor: Theme.of(context).textTheme.bodyMedium!.color,
      leading: _buildCategoryIcon(svgSrc),
      title: Text(title, style: const TextStyle(fontSize: 14)),
      textColor: Theme.of(context).textTheme.bodyLarge!.color,
      childrenPadding: const EdgeInsets.only(left: defaultPadding * 3.5),
      children: List.generate(
        subCategory.length,
        (index) => Column(
          children: [
            ListTile(
              leading: _buildCategoryIcon(subCategory[index].coverImg),
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
