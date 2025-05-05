import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:korecha/features/authentication/domain/entities/address.dart';
import 'package:korecha/features/authentication/domain/usecases/add_address.dart';
import 'package:korecha/features/authentication/domain/usecases/get_addresses.dart';
part 'address_event.dart';
part 'address_state.dart';

class AddressBloc extends Bloc<AddressEvent, AddressState> {
  final AddAddress addAddress;
  final GetAddresses getAddresses;
  AddressBloc({required this.addAddress, required this.getAddresses}) : super(AddressInitial()) {
    on<LoadAddressesEvent>(_onLoadAddresses);
    on<AddAddressEvent>(_onAddAddress);
    // on<UpdateAddressEvent>(_onUpdateAddress);
    // on<DeleteAddressEvent>(_onDeleteAddress);
     
  }
  
  FutureOr<void> _onAddAddress(AddAddressEvent event, Emitter<AddressState> emit) async {
    emit(AddressLoading());
    try {
      final result = await addAddress(event.address);
      result.fold(
        (failure) => emit(AddressError(message: failure.toString())),
        (success) => emit(AddressAdded()),
      );
      } catch (e) {
      emit(AddressError(message: e.toString()));
    }
  }

  FutureOr<void> _onLoadAddresses(LoadAddressesEvent event, Emitter<AddressState> emit) async {
    emit(AddressLoading());
    try {
      final result = await getAddresses();
      result.fold(
        (failure) => emit(AddressError(message: failure.toString())),
        (success) => emit(AddressLoaded(addresses: success)),
      );
    } catch (e) {
      emit(AddressError(message: e.toString()));
    }
  }
}

 

