class User {
  final String id;
  final String tenant;
  final String name;
  final String email;
  final String role;
  final bool is_verified;
  final String? avatar_url;
  final String? bio;
  final String? phoneNumber;
  final int? age;
  final String? gender;
  final DateTime createdAt;
  final DateTime updatedAt;

  User({
    required this.id,
    required this.tenant,
    required this.name,
    required this.email,
    required this.role,
    required this.is_verified,
    this.avatar_url,
    this.bio,
    this.phoneNumber,
    this.age,
    this.gender,
    required this.createdAt,
    required this.updatedAt,
  });
}
