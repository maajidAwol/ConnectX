import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:korecha/features/authentication/presentation/state/address/bloc/address_bloc.dart';
import 'package:korecha/features/authentication/presentation/state/profile/bloc/profile_bloc.dart';
import 'package:korecha/features/cart/presentation/state/cart/bloc/cart_bloc.dart';
import 'package:korecha/features/cart/presentation/state/order/bloc/order_bloc.dart';
import 'package:korecha/features/product/presentation/state/details/bloc/details_bloc.dart';
import 'package:korecha/features/product/presentation/state/discover/bloc/discover_bloc.dart';
import 'package:korecha/features/product/presentation/state/home/bloc/home_bloc.dart';
import 'package:korecha/features/product/presentation/state/product/bloc/product_bloc.dart';
import 'package:korecha/route/router.dart' as router;
import 'package:korecha/theme/app_theme.dart';
import 'package:korecha/features/authentication/presentation/state/auth/bloc/auth_bloc.dart';
import 'package:korecha/features/authentication/presentation/pages/auth/login_page.dart';
import 'package:korecha/features/onboarding/presentation/pages/onboarding_screen.dart';
import 'package:korecha/core/services/storage_service.dart';
import 'core/injection/injection_container.dart' as di;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await di.init();
  runApp(const MyApp());
  // Chapa.configure(privateKey: "CHASECK_TEST-uqaMQFOCPWnleUkWe9TC89n6tRvjYWtv");
}

// Thanks for using our template. You are using the free version of the template.
// 🔗 Full template: https://theflutterway.gumroad.com/l/fluttershop

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider<AuthBloc>(
          create: (_) => di.sl<AuthBloc>(),
        ),
        BlocProvider<ProductBloc>(
          create: (_) => di.sl<ProductBloc>(),
        ),
        BlocProvider<HomeBloc>(
          create: (_) => di.sl<HomeBloc>(),
        ),
        BlocProvider<DetailsBloc>(
          create: (_) => di.sl<DetailsBloc>(),
        ),
        BlocProvider<CartBloc>(
          create: (_) => di.sl<CartBloc>(),
        ),
        BlocProvider<ProfileBloc>(
          create: (_) => di.sl<ProfileBloc>(),
        ),
        BlocProvider<AddressBloc>(
          create: (_) => di.sl<AddressBloc>(),
        ),
        BlocProvider<OrderBloc>(
          create: (_) => di.sl<OrderBloc>(),
        ),
        BlocProvider<DiscoverBloc>(
          create: (_) => di.sl<DiscoverBloc>(),
        ),
      ],
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        title: 'Korecha',
        theme: AppTheme.lightTheme(context),
        themeMode: ThemeMode.light,
        onGenerateRoute: router.generateRoute,
        home: di.sl<StorageService>().hasSeenOnboarding()
            ? const LoginScreen()
            : const OnBordingScreen(),
      ),
    );
  }
}
