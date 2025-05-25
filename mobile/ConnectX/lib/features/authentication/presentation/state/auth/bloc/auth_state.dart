part of 'auth_bloc.dart';

abstract class AuthState {}

class AuthInitial extends AuthState {}

class AuthLoading extends AuthState {}

class AuthSuccess extends AuthState {
  final User user;

  AuthSuccess({required this.user});
}

class SignUpRedirectToLogin extends AuthState {
  final String email;
  final String password;
  SignUpRedirectToLogin({required this.email, required this.password});
}

class SignUpVerificationNeeded extends AuthState {
  final String email;
  final String message;

  SignUpVerificationNeeded({
    required this.email,
    this.message =
        'Please verify your email to continue. A verification link has been sent to your email.',
  });
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

class AuthError extends AuthState {
  final String message;

  AuthError({required this.message});
}

class LogoutSuccess extends AuthState {}
