import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:korecha/features/product/domain/usecases/get_product_by_id.dart';
import 'package:korecha/features/product/domain/usecases/get_product_categories.dart';
import '../../../../domain/usecases/fetch_all_products.dart';
import '../../../../domain/entities/product.dart';
import '../../../../domain/usecases/get_products_by_category.dart';

part 'product_event.dart';

part 'product_state.dart';

class ProductBloc extends Bloc<ProductEvent, ProductState> {
  final GetProductsByCategory getProductsByCategory;
  final GetProductCategories getProductCategories;
  final FetchAllProducts fetchAllProducts;
  final GetProductById getProductById;
  ProductBloc({
    required this.getProductsByCategory,
    required this.getProductCategories,
    required this.fetchAllProducts,
    required this.getProductById,
  }) : super(ProductInitial()) {
    on<LoadProducts>((event, emit) async {
      emit(ProductLoading());

      final result = await fetchAllProducts(null);
      print("result");
      print(result);

      result.fold(
        (failure) => emit(ProductError(message: 'Failed to load products')),
        (products) {
          final hotDeals =
              products
                  .where(
                    (p) =>
                        p.totalRatings >= 4 ||
                        p.totalSold > 1 ||
                        (p.priceSale ?? 0) > 0,
                  )
                  .toList();

          final countdownProducts =
              products
                  .where(
                    (p) =>
                        (p.priceSale ?? 0) > 0 &&
                        p.saleLabel.enabled &&
                        p.quantity > 0,
                  )
                  .take(2)
                  .toList();

          final specialOffer = products
              .where(
                (p) =>
                    (p.priceSale ?? 0) > 0 &&
                    p.saleLabel.enabled &&
                    p.quantity > 0,
              )
              .reduce((a, b) {
                final aAverage = (a.price + (a.priceSale ?? 0)) / 2;
                final bAverage = (b.price + (b.priceSale ?? 0)) / 2;
                final aDiscount =
                    aAverage > 0
                        ? ((a.priceSale ?? 0) - aAverage).abs() / aAverage
                        : 0;
                final bDiscount =
                    bAverage > 0
                        ? ((b.priceSale ?? 0) - bAverage).abs() / bAverage
                        : 0;
                return bDiscount > aDiscount ? b : a;
              });
          print("products");
          for (var product in products) {
            print(product);
          }
          emit(
            ProductLoaded(
              products: products,
              hotDeals: hotDeals,
              countdownProducts: countdownProducts,
              specialOffer: specialOffer,
            ),
          );
        },
      );
    });

    on<LoadProductsByCategoryId>((event, emit) async {
      emit(ProductLoading());

      final result = await getProductsByCategory(event.categoryId);

      result.fold(
        (failure) => emit(ProductError(message: 'Failed to load products')),
        (products) => emit(ProductByCategoryIdLoaded(products: products)),
      );
    });
    on<LoadProductById>(_loadProductById);
  }

  void _loadProductById(
    LoadProductById event,
    Emitter<ProductState> emit,
  ) async {
    emit(ProductDetailsLoading());
    final result = await getProductById(event.productId);

    result.fold(
      (failure) => emit(ProductDetailsError(message: 'Failed to load product')),
      (product) => emit(ProductDetailsLoaded(product: product)),
    );
  }
}
