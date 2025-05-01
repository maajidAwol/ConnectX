import 'package:dartz/dartz.dart';
import '../entities/user.dart';
import '../../../../core/error/failures.dart';
import '../entities/address.dart';

abstract class AuthRepository {
  Future<Either<Failure, User>> login(String email, String password);
  Future<Either<Failure, bool>> signup({
    required String email,
    required String password,
    required String confirmPassword,
    required String firstName,
    required String lastName,
    required String phoneNumber,
    required String sex,
    required String address,
    required bool agreement,
  });
  Future<Either<Failure, void>> logout();
    // Future<Either<Failure, User>> getUserProfile();
  Future<Either<Failure, void>> verifyEmail(String email, String otp);
  Future<Either<Failure, void>> resendVerification(String email);
  Future<Either<Failure, User>> getUserProfile();
  Future<Either<Failure, void>> updateUserProfile(User user);
  Future<Either<Failure, List<Address>>> getAddresses();
  Future<Either<Failure, void>> addAddress(Address address);
  Future<Either<Failure, void>> updateAddress(Address address);
  Future<Either<Failure, void>> deleteAddress(String id);
  bool isUserLoggedIn();
}
