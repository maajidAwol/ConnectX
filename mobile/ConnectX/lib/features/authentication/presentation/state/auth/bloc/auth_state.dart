part of 'auth_bloc.dart';

abstract class AuthState {}

class AuthInitial extends AuthState {}

class AuthLoading extends AuthState {}

class AuthSuccess extends AuthState {
  final User user;

  AuthSuccess({required this.user});
}

class SignUpSuccess extends AuthState {
  final bool success;

  SignUpSuccess({required this.success});
}

class LogoutSuccess extends AuthState {}
class AuthError extends AuthState {
  final String message;

  AuthError({required this.message});
}

class AuthVerificationRequired extends AuthState {
  final String email;
  final String message;
  final String accessToken;

  AuthVerificationRequired({
    required this.email,
    required this.message,
    required this.accessToken,
  });
     
}
