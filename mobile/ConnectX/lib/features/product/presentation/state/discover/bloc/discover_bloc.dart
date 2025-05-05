import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:korecha/core/usecases/usecase.dart';
import 'package:korecha/features/product/domain/entities/category.dart';
import 'package:korecha/features/product/domain/entities/product.dart';
import 'package:korecha/features/product/domain/usecases/get_product_categories.dart';
import 'package:korecha/features/product/domain/usecases/get_product_by_search.dart';
part 'discover_event.dart';
part 'discover_state.dart';

class DiscoverBloc extends Bloc<DiscoverEvent, DiscoverState> {
  final GetProductCategories loadCategories;
  final GetProductBySearchUseCase getProductBySearchUseCase;

  DiscoverBloc({required this.loadCategories, required this.getProductBySearchUseCase}) : super(DiscoverInitial()) {
    on<LoadDiscoverCategories>(_onLoadDiscoverCategories);
    on<SearchProductByQuery>(_onSearchProductByQuery);
  }

  void _onLoadDiscoverCategories(
    LoadDiscoverCategories event,
    Emitter<DiscoverState> emit,
  ) async {
    emit(DiscoverLoading());
    try {
      final categories = await loadCategories(NoParams());
      print(categories);
      print("tooo");
      categories.fold(
        (failure) => emit(DiscoverCategoriesError(message: failure.toString())),
        (categories) => emit(DiscoverCategoriesLoaded(categories: categories)),
      );
    } catch (e) {
      emit(DiscoverCategoriesError(message: e.toString()));
    }
    }

  void _onSearchProductByQuery(
    SearchProductByQuery event,
    Emitter<DiscoverState> emit,
  ) async {
    emit(DiscoverLoading());
    try {
      final products = await getProductBySearchUseCase(event.query);
      print(products);
      print("tooo");
      products.fold(
        (failure) => emit(DiscoverProductsError(message: failure.toString())),
        (products) => emit(DiscoverProductsLoaded(products: products)),
      );
    } catch (e) {
      emit(DiscoverProductsError(message: e.toString()));
    }
  }
}
