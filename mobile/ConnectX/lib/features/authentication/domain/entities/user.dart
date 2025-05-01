class User {
  final String id;
  final String email;
  final String firstName;
  final String lastName;
  final String phoneNumber;
  final String sex;
  final String address;
  final String role;
  final String status;
  final String avatarUrl;
  final String country;
  final String? state;
  final String city;
  final String? about;
  final String zipCode;
  final DateTime? birthdate;
  final String? company;
  final bool isVerified;
  final DateTime createdAt;
  final DateTime updatedAt;
  
  User({
    required this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
    required this.phoneNumber,
    required this.sex,
    required this.address,
    required this.role,
    required this.status,
    required this.avatarUrl,
    required this.country,
    this.state,
    required this.city,
    this.about,
    required this.zipCode,
    this.birthdate,
    this.company,
    required this.isVerified,
    required this.createdAt,
    required this.updatedAt,
  });
}
