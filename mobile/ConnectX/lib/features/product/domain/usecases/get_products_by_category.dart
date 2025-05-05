import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/product.dart';
import '../repositories/product_repository.dart';

class GetProductsByCategory implements UseCase<List<Product>, String> {
  final ProductRepository repository;

  GetProductsByCategory(this.repository);

  @override
  Future<Either<Failure, List<Product>>> call(String categoryId) async {
    final result = await repository.getProductsByCategoryId(categoryId);
    return result;

    // print("before filtering");
    // print(result);

    // For now, return all products without filtering
    // return result;

    //   return result.map((products) {

    //     switch (category) {
    //       case ProductCategory.featured:
    //         return products.where((p) => true).toList();
    //       case ProductCategory.topRated:
    //         return products.where((p) => p.isTopRated).toList();
    //       case ProductCategory.onSale:
    //         return products.where((p) => p.isOnSale).toList();
    //       case ProductCategory.shirts:
    //         return products.where((p) => p.category == "Shirt").toList();
    //       case ProductCategory.tShirts:

    //         return products.where((p) => p.category == "T-shirts").toList();
    //       case ProductCategory.jeans:
    //         return products.where((p) => p.category == "Jeans").toList();
    //       case ProductCategory.leather:
    //         return products.where((p) => p.category == "Leather").toList();
    //       case ProductCategory.accessories:
    //         return products.where((p) => p.category == "Accessories").toList();
    //       case ProductCategory.shoes:
    //         return products.where((p) => p.category == "Shoes").toList();
    //       case ProductCategory.backpacksAndBags:
    //         return products.where((p) => p.category == "Backpack").toList();
    //       case ProductCategory.bracelets:
    //         return products.where((p) => p.category == "Bracelet").toList();
    //       case ProductCategory.faceMasks:
    //         return products.where((p) => p.category == "Face Mask").toList();
    //       case ProductCategory.suits:
    //         return products.where((p) => p.category == "Suit").toList();
    //       case ProductCategory.blazers:
    //         return products.where((p) => p.category == "Blazer").toList();
    //       case ProductCategory.trousers:
    //         return products.where((p) => p.category == "Trousers").toList();
    //       case ProductCategory.waistcoats:
    //         return products.where((p) => p.category == "Waistcoat").toList();
    //       case ProductCategory.apparel:
    //         return products.where((p) => p.category == "Apparel").toList();
    //       default:
    //         return products;
    //     }
    //   });
    // }
  }
}
