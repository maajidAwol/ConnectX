class ServerException implements Exception {
  final String? message;
  ServerException(this.message);

}

class NetworkException implements Exception {}

class CacheException implements Exception {}

class ValidationException implements Exception {
  final String message;
  ValidationException(this.message);
}

class VerificationRequiredException implements Exception {
  final String message;
  final String email;
  final String accessToken;

  VerificationRequiredException({
    required this.message,
    required this.email,
    required this.accessToken,
  });
}
