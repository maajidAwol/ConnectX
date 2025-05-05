import 'package:get_it/get_it.dart';
import 'package:http/http.dart' as http;
import 'package:internet_connection_checker/internet_connection_checker.dart';
import 'package:korecha/features/authentication/domain/usecases/add_address.dart';
import 'package:korecha/features/authentication/domain/usecases/get_addresses.dart';
import 'package:korecha/features/authentication/domain/usecases/get_profile.dart';
import 'package:korecha/features/authentication/domain/usecases/logout.dart';
import 'package:korecha/features/authentication/presentation/state/address/bloc/address_bloc.dart';
import 'package:korecha/features/authentication/presentation/state/profile/bloc/profile_bloc.dart';
import 'package:korecha/features/cart/data/datasources/order_remote_datasource.dart';
import 'package:korecha/features/cart/data/repositories/order_repository_impl.dart';
import 'package:korecha/features/cart/domain/repositories/order_repository.dart';
import 'package:korecha/features/cart/domain/usecases/add_to_cart.dart';
import 'package:korecha/features/cart/domain/usecases/create_cod_order.dart';
import 'package:korecha/features/cart/domain/usecases/get_cart_items.dart';
import 'package:korecha/features/cart/presentation/state/order/bloc/order_bloc.dart';
import 'package:korecha/features/product/domain/usecases/fetch_all_products.dart';
import 'package:korecha/features/product/domain/usecases/get_filtered_products.dart';
import 'package:korecha/features/product/domain/usecases/get_product_by_id.dart';
import 'package:korecha/features/product/domain/usecases/get_product_by_search.dart';
import 'package:korecha/features/product/domain/usecases/get_product_categories.dart';
import 'package:korecha/features/product/presentation/state/details/bloc/details_bloc.dart';
import 'package:korecha/features/product/presentation/state/discover/bloc/discover_bloc.dart';
import 'package:korecha/features/product/presentation/state/home/bloc/home_bloc.dart';
import '../network/network_info.dart';
import '../../features/authentication/data/datasources/auth_remote_data_source.dart';
import '../../features/authentication/data/repositories/auth_repository_impl.dart';
import '../../features/authentication/domain/repositories/auth_repository.dart';
import '../../features/authentication/domain/usecases/login.dart';
import '../../features/authentication/domain/usecases/signup.dart';
import '../../features/authentication/presentation/state/auth/bloc/auth_bloc.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/storage_service.dart';
import '../../features/product/data/datasources/product_remote_data_source.dart';
import '../../features/product/data/repositories/product_repository_impl.dart';
import '../../features/product/domain/repositories/product_repository.dart';
import '../../features/product/domain/usecases/get_products_by_category.dart';
import '../../features/product/presentation/state/product/bloc/product_bloc.dart';
import '../../features/cart/data/datasources/cart_local_data_source.dart';
import '../../features/cart/data/repositories/cart_repository_impl.dart';
import '../../features/cart/domain/repositories/cart_repository.dart';
import '../../features/cart/presentation/state/cart/bloc/cart_bloc.dart';
import '../../features/cart/domain/usecases/create_chapa_order.dart';
import '../../features/cart/domain/usecases/get_orders.dart';

final sl = GetIt.instance;
const baseUrl = 'https://api.korecha.com.et';

Future<void> init() async {
  // External Dependencies
  final sharedPreferences = await SharedPreferences.getInstance();
  sl.registerSingleton<SharedPreferences>(sharedPreferences);
  sl.registerLazySingleton(() => http.Client());
  sl.registerLazySingleton(() => InternetConnectionChecker());

  // Core
  sl.registerLazySingleton<NetworkInfo>(() => NetworkInfoImpl(sl()));
  sl.registerLazySingleton(() => StorageService(sl()));

  // Features - Cart
  // Cart Data sources
  sl.registerLazySingleton<CartLocalDataSource>(
    () => CartLocalDataSourceImpl(sharedPreferences: sl()),
  );

  // Cart Repository
  sl.registerLazySingleton<CartRepository>(
    () => CartRepositoryImpl(localDataSource: sl()),
  );

  // Cart Use cases

  // Cart Bloc
  sl.registerFactory(
    () => CartBloc(
      addToCartUseCase: sl(),
      getCartItemsUseCase: sl(),
      repository: sl(),
    ),
  );

  // Features - Auth
  // Data sources
  sl.registerLazySingleton<AuthRemoteDataSource>(
    () => AuthRemoteDataSourceImpl(
      client: sl(),
      baseUrl: baseUrl,
      storageService: sl(),
    ),
  );

  // Repository
  sl.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(
      remoteDataSource: sl(),
      networkInfo: sl(),
      storageService: sl(),
    ),
  );
  sl.registerLazySingleton<OrderRepository>(
    () => OrderRepositoryImpl(
      remoteDataSource: sl(),
      networkInfo: sl(),
    ),
  );

  // Use cases
  sl.registerLazySingleton(() => Login(sl()));
  sl.registerLazySingleton(() => SignUp(sl()));
  sl.registerLazySingleton(() => GetProfile(sl()));
  sl.registerLazySingleton(() => Logout(sl()));
  sl.registerLazySingleton(() => AddAddress(sl()));
  sl.registerLazySingleton(() => GetAddresses(sl()));
  sl.registerLazySingleton(() => CreateChapaOrderUseCase(repository: sl()));
  sl.registerLazySingleton(() => CreateCodOrderUseCase(repository: sl()));
  sl.registerLazySingleton(() => GetOrdersUseCase(sl()));
  sl.registerLazySingleton(() => GetProductsByCategory(sl()));
  sl.registerLazySingleton(() => GetFilteredProducts(sl()));
  sl.registerLazySingleton(() => GetProductById(sl()));
  sl.registerLazySingleton(() => GetProductCategories(sl()));
  sl.registerLazySingleton(() => FetchAllProducts(sl()));
  sl.registerLazySingleton(() => AddToCartUseCase(repository: sl()));
  sl.registerLazySingleton(() => GetCartItemsUseCase(repository: sl()));
  sl.registerLazySingleton(() => GetProductBySearchUseCase(repository: sl()));
  // sl.registerLazySingleton(() => GetOrders(repository: sl()));
  // sl.registerLazySingleton(() => UpdateAddress(sl()));
  // sl.registerLazySingleton(() => DeleteAddress(sl()));

  // Bloc
  sl.registerFactory(
    () => AuthBloc(
      login: sl(),
      signup: sl(),
      remoteDataSource: sl(),
      logout: sl(),
    ),
  );
  sl.registerFactory(
    () => ProfileBloc(
      getProfile: sl(),
    ),
  );
  sl.registerFactory(
    () => AddressBloc(
      addAddress: sl(),
      // getAddresses: sl(),
      getAddresses: sl(),
    ),
  );
  sl.registerFactory(
    () => OrderBloc(
      createChapaOrderUseCase: sl(),
      createCashOnDeliveryOrderUseCase: sl(),
      getOrdersUseCase: sl(),
    ),
  );
  sl.registerFactory(
    () => DiscoverBloc(
      loadCategories: sl(),
      getProductBySearchUseCase: sl(),
    ),
  );

  // Features - Product
  // Data sources
  sl.registerLazySingleton<ProductRemoteDataSource>(
    () => ProductRemoteDataSourceImpl(
      client: sl(),
      baseUrl: baseUrl,
    ),
  );

  sl.registerLazySingleton<OrderRemoteDataSource>(
    () => OrderRemoteDataSourceImpl(
      client: sl(),
      storageService: sl(),
    ),
  );

  // Repository
  sl.registerLazySingleton<ProductRepository>(
    () => ProductRepositoryImpl(
      remoteDataSource: sl(),
      networkInfo: sl(),
    ),
  );

  // Use cases

  // Blocs
  sl.registerFactory(
    () => ProductBloc(
      getProductsByCategory: sl(),
      getProductCategories: sl(),
      fetchAllProducts: sl(),
      getProductById: sl(),
    ),
  );
  sl.registerFactory(
    () => HomeBloc(
      repository: sl(),
      getFilteredProducts: sl(),
      getProductCategories: sl(),
    ),
  );
  sl.registerFactory(
    () => DetailsBloc(
      getProductById: sl(),
    ),
  );
}
