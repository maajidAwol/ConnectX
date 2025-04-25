import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/network/network_info.dart';
import '../../../../core/services/storage_service.dart';
import '../../domain/entities/user.dart';
import '../../domain/entities/address.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_remote_data_source.dart';
import '../models/address_model.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;
  final NetworkInfo networkInfo;
  final StorageService storageService;

  AuthRepositoryImpl({
    required this.remoteDataSource,
    required this.networkInfo,
    required this.storageService,
  });

  @override
  Future<Either<Failure, User>> login(String email, String password) async {
    if (await networkInfo.isConnected) {
      try {
        final user = await remoteDataSource.login(email, password);
        return Right(user);
      } on ServerException catch (e) {
        return Left(ServerFailure(message: e.message));
      } on VerificationRequiredException catch (e) {
        return Left(VerificationRequiredFailure(
          message: e.message,
          email: e.email,
          accessToken: e.accessToken,
        ));
      }
    } else {
      return Left(NetworkFailure());
    }
  }

  @override
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
  }) async {
    if (await networkInfo.isConnected) {
      try {
        final result = await remoteDataSource.signup(
          email,
          password,
          confirmPassword,
          firstName,
          lastName,
          phoneNumber,
          sex,
          address,
          agreement,
        );
        if (result == true) {
          return Right(true);
        } else {
          return Left(ServerFailure(message: 'Signup failed'));
        }
      } on ServerException catch (e) {
        return Left(ServerFailure(message: e.message));
      } on ValidationException catch (e) {
        return Left(ValidationFailure( e.message));
      }
    } else {
      return Left(NetworkFailure());
    }
  }

  @override
  Future<Either<Failure, void>> logout() async {
    try {
      await remoteDataSource.logout();
      await storageService.clearAuthData();
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    }
  }

  @override
  Future<Either<Failure, List<Address>>> getAddresses() async {
    if (await networkInfo.isConnected) {
      try {
        final addresses = await remoteDataSource.getAddresses();
        return Right(addresses);
      } on ServerException catch (e) {
        return Left(ServerFailure(message: e.message));
      }
    } else {
      return Left(NetworkFailure());
    }
  }

  @override
  Future<Either<Failure, void>> addAddress(Address address) async {
    if (await networkInfo.isConnected) {
      try {
        await remoteDataSource.addAddress(AddressModel(
          id: address.id,
          fullAddress: address.fullAddress,
          primary: address.primary,
          phoneNumber: address.phoneNumber,
          addressType: address.addressType,
        ));
        return const Right(null);
      } on ServerException catch (e) {
        return Left(ServerFailure(message: e.message));
      }
    } else {
      return Left(NetworkFailure());
    }
  }

  @override
  Future<Either<Failure, void>> updateAddress(Address address) async {
    if (await networkInfo.isConnected) {
      try {
        await remoteDataSource.updateAddress(AddressModel(
          id: address.id,
          fullAddress: address.fullAddress,
          primary: address.primary,
          phoneNumber: address.phoneNumber,
          addressType: address.addressType,
        ));
        return const Right(null);
      } on ServerException catch (e) {
        return Left(ServerFailure(message: e.message));
      }
    } else {
      return Left(NetworkFailure());
    }
  }

  @override
  Future<Either<Failure, void>> deleteAddress(String id) async {
    if (await networkInfo.isConnected) {
      try {
        await remoteDataSource.deleteAddress(id);
        return const Right(null);
      } on ServerException catch (e) {
        return Left(ServerFailure(message: e.message));
      }
    } else {
      return Left(NetworkFailure());
    }
  }

  @override
  bool isUserLoggedIn() {
    return storageService.isUserLoggedIn();
  }

  // @override
  // Future<Either<Failure, User>> getUserProfile() async {
  //   if (await networkInfo.isConnected) {
  //     try {
  //       final user = await remoteDataSource.getUserProfile();
  //       return Right(user);
  //     } on ServerException catch (e) {
  //       return Left(ServerFailure(message: e.message));
  //     }
  //   } else {
  //     return Left(NetworkFailure());
  //   }
  // }

  @override
  Future<Either<Failure, void>> verifyEmail(String email, String otp) async {
    if (await networkInfo.isConnected) {
      try {
        await remoteDataSource.verifyEmail(email, otp);
        return const Right(null);
      } on ValidationException catch (e) {
        return Left(ValidationFailure(e.message));
      }
    } else {
      return Left(NetworkFailure());
    }
  }

  @override
  Future<Either<Failure, void>> resendVerification(String email) async {
    if (await networkInfo.isConnected) {
      try {
        await remoteDataSource.resendVerification(email);
        return const Right(null);
      } on ValidationException catch (e) {
        return Left(ValidationFailure(e.message));
      }
    } else {
      return Left(NetworkFailure());
    }
  }

  @override
  Future<Either<Failure, User>> getUserProfile() async {
    if (await networkInfo.isConnected) {
      try {
        final user = await remoteDataSource.getUserProfile();
        return Right(user);
      } on ValidationException catch (e) {
        return Left(ValidationFailure(e.message));
      }
    } else {
      return Left(NetworkFailure());
    }
  }

  @override
  Future<Either<Failure, void>> updateUserProfile(User user) async {
    if (await networkInfo.isConnected) {
      try {
        // TODO: Implement updateUserProfile in remote data source
        // await remoteDataSource.updateUserProfile(user);
        return const Right(null);
      } on ServerException catch (e) {
        return Left(ServerFailure(message: e.message));
      }
    } else {
      return Left(NetworkFailure());
    }
  }
}
