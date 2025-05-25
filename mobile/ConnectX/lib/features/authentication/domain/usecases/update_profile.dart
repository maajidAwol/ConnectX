import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/user.dart';
import '../repositories/auth_repository.dart';

class UpdateProfile implements UseCase<User, UpdateProfileParams> {
  final AuthRepository repository;

  UpdateProfile(this.repository);

  @override
  Future<Either<Failure, User>> call(UpdateProfileParams params) async {
    return await repository.updateProfile(
      name: params.name,
      bio: params.bio,
      phoneNumber: params.phoneNumber,
      avatarPath: params.avatarPath,
    );
  }
}

class UpdateProfileParams {
  final String? name;
  final String? bio;
  final String? phoneNumber;
  final String? avatarPath;

  UpdateProfileParams({this.name, this.bio, this.phoneNumber, this.avatarPath});
}
