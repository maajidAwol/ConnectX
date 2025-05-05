class Address {
  final String id;
  final String label;
  final String fullAddress;
  final String phoneNumber;
  final bool isDefault;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  const Address({
    required this.id,
    required this.label,
    required this.fullAddress,
    required this.phoneNumber,
    required this.isDefault,
    this.createdAt,
    this.updatedAt,
  });
}
