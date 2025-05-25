import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../domain/usecases/login.dart';
import '../../../../domain/usecases/signup.dart';
import '../../../../../../core/error/failures.dart';
import '../../../../domain/entities/user.dart';
import '../../../../data/datasources/auth_remote_data_source.dart';
import '../../../../domain/usecases/logout.dart';
import '../../../../../../core/usecases/usecase.dart';
import '../../../../../../core/constants/app_constants.dart';
part 'auth_event.dart';

part 'auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final Login login;
  final SignUp signup;
  final Logout logout;
  final AuthRemoteDataSource remoteDataSource;

  AuthBloc({
    required this.login,
    required this.signup,
    required this.remoteDataSource,
    required this.logout,
  }) : super(AuthInitial()) {
    on<LoginRequested>((event, emit) async {
      emit(AuthLoading());

      final result = await login(
        LoginParams(email: event.email, password: event.password),
      );

      result.fold((failure) {
        if (failure is ValidationFailure) {
          emit(AuthError(message: failure.message));
        } else if (failure is ServerFailure) {
          emit(AuthError(message: failure.message ?? 'Server Error'));
        } else if (failure is NetworkFailure) {
          emit(AuthError(message: 'Please check your internet connection'));
        } else if (failure is VerificationRequiredFailure) {
          emit(
            AuthVerificationRequired(
              email: failure.email,
              message: failure.message,
              accessToken: failure.accessToken,
            ),
          );
        }
      }, (user) => emit(AuthSuccess(user: user)));
    });

    on<SignUpRequested>((event, emit) async {
      emit(AuthLoading());

      final email = event.email;
      final password = event.password;

      final result = await signup(
        SignUpParams(name: event.name, email: email, password: password),
      );

      result.fold(
        (failure) {
          if (failure is ValidationFailure) {
            emit(AuthError(message: failure.message));
          } else if (failure is ServerFailure) {
            emit(AuthError(message: failure.message ?? 'Server Error'));
          } else if (failure is NetworkFailure) {
            emit(AuthError(message: 'Please check your internet connection'));
          } else {
            emit(AuthError(message: failure.toString()));
          }
        },
        (user) {
          if (user.is_verified == false) {
            emit(SignUpVerificationNeeded(email: email));
          } else {
            emit(SignUpRedirectToLogin(email: email, password: password));
          }
        },
      );
    });

    on<LogoutRequested>((event, emit) async {
      emit(AuthLoading());
      final result = await logout();
      result.fold(
        (failure) => emit(AuthError(message: failure.toString())),
        (_) => emit(LogoutSuccess()),
      );
    });
  }
}
