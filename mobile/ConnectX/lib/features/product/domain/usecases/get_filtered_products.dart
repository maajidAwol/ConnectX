import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/product.dart';
import '../repositories/product_repository.dart';

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

  class GetFilteredProducts implements UseCase<Map<ProductFilter, List<Product>>, void> {
  final ProductRepository repository;

  GetFilteredProducts(this.repository);

  @override
Future<Either<Failure, Map<ProductFilter, List<Product>>>> call(void params) async {
    final result = await repository.getProducts();

    return result.map((products) {
      final Map<ProductFilter, List<Product>> filteredProducts = {};

      filteredProducts[ProductFilter.allProducts] = products;
      filteredProducts[ProductFilter.featured] = products;
      filteredProducts[ProductFilter.hotDeals] = products;
      filteredProducts[ProductFilter.topBrands] = products;
      filteredProducts[ProductFilter.countDownProducts] =  products;
      filteredProducts[ProductFilter.popularProducts] = products;
      filteredProducts[ProductFilter.specialOffers] = products;
         
      filteredProducts[ProductFilter.topProducts] = products;

      return filteredProducts;
    });
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