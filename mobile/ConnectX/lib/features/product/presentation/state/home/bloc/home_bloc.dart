import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:korecha/features/product/domain/entities/category.dart';
import 'package:korecha/features/product/domain/entities/product.dart';
import 'package:korecha/features/product/domain/repositories/product_repository.dart';
import 'package:korecha/features/product/domain/usecases/get_filtered_products.dart';
import 'package:korecha/features/product/domain/usecases/get_product_categories.dart';

part 'home_event.dart';
part 'home_state.dart';

class HomeBloc extends Bloc<HomeEvent, HomeState> {
  final ProductRepository repository;
  final GetFilteredProducts getFilteredProducts;
  final GetProductCategories getProductCategories;

  HomeBloc({
    required this.repository,
    required this.getFilteredProducts,
    required this.getProductCategories,
  }) : super(HomeInitial()) {
    on<LoadProductsByFilter>(_onHomeEvent);
  }

  Future<void> _onHomeEvent(HomeEvent event, Emitter<HomeState> emit) async  {
    if (event is LoadProductsByFilter) {
      emit(HomeLoading());
      final result = await getFilteredProducts(null);
      final categoriesResult = await getProductCategories(null);
      
      result.fold(
        (failure) => emit(HomeError(failure.toString())),
        (products) => emit(HomeLoaded(products, categoriesResult.fold(
          (failure) => [],
          (categories) => categories,
        ))),
      );
    }
  }
}
