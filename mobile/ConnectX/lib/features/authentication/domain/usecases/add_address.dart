import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/address.dart';
import '../repositories/auth_repository.dart';

class AddAddress implements UseCase<void, Address> {
  final AuthRepository repository;

  AddAddress(this.repository);

  @override
  Future<Either<Failure, void>> call(Address address) async {
    return await repository.addAddress(address);
  }
}
