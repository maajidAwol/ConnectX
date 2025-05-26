import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/product.dart';
import '../repositories/product_repository.dart';
import '../services/product_filter_service.dart';

enum ProductFilter {
  allProducts,
  featured,
  hotDeals,
  topBrands,
  countDownProducts,
  popularProducts,
  specialOffers,
  topProducts,
}

class GetFilteredProducts
    implements UseCase<Map<ProductFilter, List<Product>>, void> {
  final ProductRepository repository;
  final ProductFilterService filterService;

  GetFilteredProducts(this.repository, this.filterService);

  @override
  Future<Either<Failure, Map<ProductFilter, List<Product>>>> call(
    void params,
  ) async {
    try {
      // Try to get products from multiple pages for better variety
      final result = await repository.getAllProductsAcrossPages(maxPages: 3);

      return result.map((products) {
        if (products.isEmpty) {
          // Return empty maps for all filters if no products
          return ProductFilter.values.fold<Map<ProductFilter, List<Product>>>(
            {},
            (map, filter) => map..[filter] = [],
          );
        }

        // Use the filter service to categorize products
        final filteredProducts = filterService.filterProducts(products);

        // Sort products by relevance for each category
        filterService.sortProductsByRelevance(filteredProducts);

        return filteredProducts;
      });
    } catch (e) {
      return Left(ServerFailure(message: 'Failed to filter products: $e'));
    }
  }

  // List<Product> _getTopBrands(List<Product> products) {
  //   final brandMap = products.fold<Map<String, Map<String, dynamic>>>({}, (acc, product) {
  //     final brand = product.brand ?? 'Other';
  //     if (!acc.containsKey(brand)) {
  //       acc[brand] = {
  //         'products': [],
  //         'totalSales': 0,
  //         'logo': product.brandLogo ?? getBrandIcon(brand),
  //         'description': product.brandDescription ?? getDefaultBrandDescription(brand),
  //       };
  //     }
  //     acc[brand]['products'].add(product);
  //     acc[brand]['totalSales'] += product.totalSold ?? 0;
  //     return acc;
  //   });

  //   final topBrands = brandMap.entries.toList()
  //     ..sort((a, b) => b.value['totalSales'] - a.value['totalSales']);

  //   return topBrands.take(1).expand((entry) => entry.value['products']).toList();
  // }
}
