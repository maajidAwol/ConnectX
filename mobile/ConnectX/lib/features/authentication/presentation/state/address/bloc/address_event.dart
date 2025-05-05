part of 'address_bloc.dart';

@immutable
sealed class AddressEvent {}

class LoadAddressesEvent extends AddressEvent {}

class AddAddressEvent extends AddressEvent {
  final Address address;

  AddAddressEvent({required this.address});
}

class UpdateAddressEvent extends AddressEvent {
  final Address address;

  UpdateAddressEvent({required this.address});
}

class DeleteAddressEvent extends AddressEvent {
  final String id;

  DeleteAddressEvent({required this.id});
}
