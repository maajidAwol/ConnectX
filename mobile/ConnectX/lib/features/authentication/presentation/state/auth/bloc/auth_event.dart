part of 'auth_bloc.dart';

abstract class AuthEvent {}

class LoginRequested extends AuthEvent {
  final String email;
  final String password;

  LoginRequested({required this.email, required this.password});
}

class SignUpRequested extends AuthEvent {
  final String name;
  final String email;
  final String password;
  final int? age;
  final String? gender;

  SignUpRequested({
    required this.name,
    required this.email,
    required this.password,
    this.age,
    this.gender,
  });
}

class LogoutRequested extends AuthEvent {}

class VerifyEmailRequested extends AuthEvent {
  final String email;
  final String otp;

  VerifyEmailRequested({required this.email, required this.otp});
}

class ResendVerificationRequested extends AuthEvent {
  final String email;

  ResendVerificationRequested({required this.email});
}
