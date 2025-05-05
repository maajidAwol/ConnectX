abstract class Failure {}

class ServerFailure extends Failure {
  final String? message;
  ServerFailure({this.message});
}

class NetworkFailure extends Failure {}

class CacheFailure extends Failure {}

class ValidationFailure extends Failure {
  final String message;
  ValidationFailure(this.message);
}

class VerificationRequiredFailure extends Failure {
  final String message;
  final String email;
  final String accessToken;

  VerificationRequiredFailure({
    required this.message,
    required this.email,
    required this.accessToken,
  });
}
