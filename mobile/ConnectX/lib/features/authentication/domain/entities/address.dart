class Address {
  final String id;
  final String fullAddress;
  final bool primary;
  final String phoneNumber;
  final String addressType;

  const Address({
    required this.id,
    required this.fullAddress,
    required this.primary,
    required this.phoneNumber,
    required this.addressType,
  });
}
