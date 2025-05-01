import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:korecha/features/product/domain/entities/product.dart';
import 'package:korecha/features/product/domain/usecases/get_product_by_id.dart';
part 'details_event.dart';
part 'details_state.dart';

class DetailsBloc extends Bloc<DetailsEvent, DetailsState> {

  final GetProductById getProductById;
  DetailsBloc({ required this.getProductById}) : super(DetailsInitial()) {
        on<LoadProductDetails>(_loadProductDetails);

  }
   void _loadProductDetails(
      LoadProductDetails event, Emitter<DetailsState> emit) async {
    emit(DetailsLoading());
    final result = await getProductById.call(event.productId);
    
    result.fold(
      (failure) => emit(DetailsError(message: 'Failed to load product')),
      (product) => emit(DetailsLoaded(product: product)),
    );
  }
}
