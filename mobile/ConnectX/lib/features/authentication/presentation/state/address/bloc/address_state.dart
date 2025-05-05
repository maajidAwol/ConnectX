part of 'address_bloc.dart';

@immutable
sealed class AddressState {}

final class AddressInitial extends AddressState {}

final class AddressLoading extends AddressState {}

final class AddressLoaded extends AddressState {
  final List<Address> addresses;

  AddressLoaded({required this.addresses});
}

final class AddressError extends AddressState {
  final String message;

  AddressError({required this.message});
}

final class AddressAdded extends AddressState {}

final class AddressUpdated extends AddressState {}

final class AddressDeleted extends AddressState {}
