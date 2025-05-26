import '../../domain/entities/user.dart';

class UserModel extends User {
  UserModel({
    required super.id,
    required super.tenant,
    required super.name,
    required super.email,
    required super.role,
    required super.is_verified,
    super.avatar_url,
    super.bio,
    super.phoneNumber,
    super.age,
    super.gender,
    required super.createdAt,
    required super.updatedAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    // Check if the input is from the 'user' sub-object in the login response
    final userData =
        json.containsKey('user') && json['user'] is Map<String, dynamic>
            ? json['user'] as Map<String, dynamic>
            : json; // Assume it's already the user object if 'user' key doesn't exist

    return UserModel(
      id: userData['id']?.toString() ?? '',
      tenant: userData['tenant']?.toString() ?? '', // Added tenant
      name:
          userData['name']?.toString() ?? '', // Changed from firstName/lastName
      email: userData['email']?.toString() ?? '',
      role: userData['role']?.toString() ?? 'customer', // Default role
      is_verified: userData['is_verified'] as bool? ?? false, // Changed name
      avatar_url: userData['avatar_url']?.toString(), // Changed name
      bio: userData['bio']?.toString(), // Added bio field
      phoneNumber:
          userData['phone_number']?.toString(), // Added phone_number field
      age: userData['age'] as int?, // Added age field
      gender: userData['gender']?.toString(), // Added gender field
      createdAt: DateTime.parse(
        userData['created_at']?.toString() ?? DateTime.now().toIso8601String(),
      ), // Changed name
      updatedAt: DateTime.parse(
        userData['updated_at']?.toString() ?? DateTime.now().toIso8601String(),
      ), // Changed name
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'tenant': tenant,
      'name': name,
      'email': email,
      'role': role,
      'is_verified': is_verified,
      'avatar_url': avatar_url,
      'bio': bio,
      'phone_number': phoneNumber,
      'age': age,
      'gender': gender,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }
}
