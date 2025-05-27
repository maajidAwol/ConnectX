import 'package:flutter/material.dart';
import 'package:korecha/components/network_image_with_loader.dart';
import '../../../domain/entities/product.dart';

class ProductCard extends StatelessWidget {
  final Product product;

  const ProductCard({super.key, required this.product});

  Color _getColorFromName(String colorName) {
    switch (colorName.toLowerCase()) {
      case 'red':
        return Colors.red;
      case 'green':
        return Colors.green;
      case 'blue':
        return Colors.blue;
      case 'yellow':
        return Colors.yellow;
      case 'black':
        return Colors.black;
      case 'white':
        return Colors.white;
      case 'grey':
      case 'gray':
        return Colors.grey;
      case 'purple':
        return Colors.purple;
      case 'pink':
        return Colors.pink;
      case 'orange':
        return Colors.orange;
      case 'brown':
        return Colors.brown;
      case 'cyan':
        return Colors.cyan;
      case 'teal':
        return Colors.teal;
      default:
        return Colors.transparent; // Or a default color like Colors.grey
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            height: 120,
            width: double.infinity,
            child: NetworkImageWithLoader(
              product.coverUrl,
              fit: BoxFit.cover,
              radius: 0, // Assuming no radius for card top image
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  product.name,
                  style: Theme.of(context).textTheme.titleMedium,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Text(
                      '\$${product.price}',
                      style: TextStyle(
                        decoration:
                            product.priceSale != null
                                ? TextDecoration.lineThrough
                                : null,
                      ),
                    ),
                    if (product.priceSale != null) ...[
                      const SizedBox(width: 8),
                      Text(
                        '\$${product.priceSale}',
                        style: const TextStyle(
                          color: Colors.red,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ],
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.star, size: 16, color: Colors.amber),
                    Text('${product.totalRatings} (${product.totalReviews})'),
                  ],
                ),
                if (product.colors.isNotEmpty) ...[
                  const SizedBox(height: 8),
                  Row(
                    children:
                        product.colors.map((colorName) {
                          final color = _getColorFromName(colorName);
                          if (color == Colors.transparent &&
                              colorName.isNotEmpty) {
                            // Optionally, handle unrecognized colors differently,
                            // e.g. log them or show a placeholder.
                            // For now, we just don't render a circle if color is transparent.
                            return const SizedBox.shrink();
                          }
                          return Container(
                            margin: const EdgeInsets.only(right: 4.0),
                            width: 16,
                            height: 16,
                            decoration: BoxDecoration(
                              color: color,
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: Theme.of(context).dividerColor,
                                width: color == Colors.white ? 1 : 0.5,
                              ),
                            ),
                          );
                        }).toList(),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}
