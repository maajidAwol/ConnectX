import 'package:dartz/dartz.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/user.dart';
import '../repositories/auth_repository.dart';

class SignUpParams {
  final String name;
  final String email;
  final String password;
  final String role;
  final int? age;
  final String? gender;

  SignUpParams({
    required this.name,
    required this.email,
    required this.password,
    this.role = 'customer',
    this.age,
    this.gender,
  });
}

class SignUp implements UseCase<User, SignUpParams> {
  final AuthRepository repository;

  SignUp(this.repository);

  @override
  Future<Either<Failure, User>> call(SignUpParams params) async {
    return await repository.signup(
      name: params.name,
      email: params.email,
      password: params.password,
      role: params.role,
      age: params.age,
      gender: params.gender,
    );
  }
}
