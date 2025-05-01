part of 'auth_bloc.dart';

abstract class AuthEvent {}

class LoginRequested extends AuthEvent {
  final String email;
  final String password;

  LoginRequested({required this.email, required this.password});
}

class SignUpRequested extends AuthEvent {
  final String email;
  final String password;
  final String confirmPassword;
  final String firstName;
  final String lastName;
  final String phoneNumber;
  final String sex;
  final String address;
  final bool agreement;

  SignUpRequested({
    required this.email,
    required this.password,
    required this.confirmPassword,
    required this.firstName,
    required this.lastName,
    required this.phoneNumber,
    required this.sex,
    required this.address,
    required this.agreement,
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
