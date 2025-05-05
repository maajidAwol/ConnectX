import '../../domain/entities/address.dart';

class AddressModel extends Address {
  const AddressModel({
    required super.id,
    required super.fullAddress,
    required super.primary,
    required super.phoneNumber,
    required super.addressType,
  });

  factory AddressModel.fromJson(Map<String, dynamic> json) {
    return AddressModel(
      id: json['id'].toString(),
      fullAddress: json['fullAddress'],
      primary: json['primary'] ?? false,
      phoneNumber: json['phoneNumber'],
      addressType: json['addressType'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'fullAddress': fullAddress,
      'primary': primary,
      'phoneNumber': phoneNumber,
      'addressType': addressType,
    };
  }
}
