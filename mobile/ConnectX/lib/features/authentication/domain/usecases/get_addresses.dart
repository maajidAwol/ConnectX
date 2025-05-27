import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/address.dart';
import '../repositories/auth_repository.dart';

class GetAddresses {
  final AuthRepository repository;

  GetAddresses(this.repository);

  Future<Either<Failure, List<Address>>> call() async {
    return await repository.getAddresses();
  }
}
