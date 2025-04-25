import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/user.dart';
import '../repositories/auth_repository.dart';

class SignUpParams {
  final String email;
  final String password;
  final String confirmPassword;
  final String firstName;
  final String lastName;
  final String phone;
  final String sex;
  final String address;
  final bool agreement;
  final String role;

  SignUpParams({
    required this.email,
    required this.password,
    required this.confirmPassword,
    required this.firstName,
    required this.lastName,
    required this.phone,
    required this.sex,
    required this.address,
    required this.agreement,
    this.role = 'customer',
  });
}

class SignUp implements UseCase<bool, SignUpParams> {
  final AuthRepository repository;

  SignUp(this.repository);

  @override
  Future<Either<Failure, bool>> call(SignUpParams params) async {
    return await repository.signup(
      email: params.email,
      password: params.password,
      confirmPassword: params.confirmPassword,
      firstName: params.firstName,
      lastName: params.lastName,
      phoneNumber: params.phone,
      sex: params.sex,
      address: params.address,
      agreement: params.agreement,
    );
  }
}
