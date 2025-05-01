import '../../domain/entities/user.dart';

class UserModel extends User {
  UserModel({
    required super.id,
    required super.email,
    required super.firstName,
    required super.lastName,
    required super.phoneNumber,
    required super.sex,
    required super.address,
    required super.role,
    required super.status,
    required super.avatarUrl,
    required super.country,
    super.state,
    required super.city,
    super.about,
    required super.zipCode,
    super.birthdate,
    super.company,
    required super.isVerified,
    required super.createdAt,
    required super.updatedAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    // Handle registration response
    if (json['success'] == true && json['message'] != null) {
      return UserModel(
        id: '',
        email: json['email'] ?? '',
        firstName: json['firstName'] ?? '',
        lastName: json['lastName'] ?? '',
        phoneNumber: json['phoneNumber'] ?? '',
        sex: json['sex'] ?? '',
        address: json['address'] ?? '',
        role: 'customer',
        status: 'pending',
        avatarUrl: json['avatarUrl'] ?? '',
        country: json['country'] ?? '',
        city: json['city'] ?? '',
        zipCode: json['zipCode'] ??'',
        isVerified: false,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );
    }

    // Handle login response
    final userData = json['user'] as Map<String, dynamic>;

    return UserModel(
      id: userData['id']?.toString() ?? '',
      email: userData['email']?.toString() ?? '',
      firstName: userData['firstName']?.toString() ?? '',
      lastName: userData['lastName']?.toString() ?? '',
      phoneNumber: userData['phoneNumber']?.toString() ?? '',
      sex: userData['sex']?.toString() ?? '',
      address: userData['address']?.toString() ?? '',
      role: userData['role']?.toString() ?? '',
      status: userData['status']?.toString() ?? '',
      avatarUrl: userData['avatarUrl']?.toString() ?? '',
      country: userData['country']?.toString() ?? '',
      state: userData['state']?.toString(),
      city: userData['city']?.toString() ?? '',
      about: userData['about']?.toString(),
      zipCode: userData['zipCode']?.toString() ?? '',
      birthdate: userData['birthdate'] != null
          ? DateTime.parse(userData['birthdate'].toString())
          : null,
      company: userData['company']?.toString(),
      isVerified: userData['isVerified'] as bool? ?? false,
      createdAt: DateTime.parse(userData['created_at']?.toString() ??
          DateTime.now().toIso8601String()),
      updatedAt: DateTime.parse(userData['updated_at']?.toString() ??
          DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'firstName': firstName,
      'lastName': lastName,
      'phoneNumber': phoneNumber,
      'sex': sex,
      'address': address,
      'role': role,
      'status': status,
      'avatarUrl': avatarUrl,
      'country': country,
      'state': state,
      'city': city,
      'about': about,
      'zipCode': zipCode,
      'birthdate': birthdate?.toIso8601String(),
      'company': company,
      'isVerified': isVerified,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }
}
