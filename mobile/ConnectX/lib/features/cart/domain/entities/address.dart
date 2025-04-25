class Address {
  final String id;
  final String name;
  final String fullAddress;
  final String city;
  final String country;
  final String phoneNumber;
  final bool isDefault;
  final String? mapPreviewUrl;

  const Address({
    required this.id,
    required this.name,
    required this.fullAddress,
    required this.city,
    required this.country,
    required this.phoneNumber,
    this.isDefault = false,
    this.mapPreviewUrl,
  });
}
