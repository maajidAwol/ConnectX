import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../../core/error/exceptions.dart';
import '../../../../core/services/storage_service.dart';
import '../models/user_model.dart';
import '../models/address_model.dart';

abstract class AuthRemoteDataSource {
  Future<UserModel> login(String email, String password);
  Future<UserModel> signup({
    required String tenant,
    required String name,
    required String email,
    required String password,
    required String role,
  });
  Future<void> logout();
  // Future<UserModel> getCurrentUser();
  Future<void> verifyEmail(String email, String otp);
  Future<void> resendVerification(String email);
  Future<UserModel> getUserProfile();
  // Future<void> updateUserProfile(UserModel user);
  Future<void> addAddress(AddressModel address);
  Future<List<AddressModel>> getAddresses();
  Future<void> updateAddress(AddressModel address);
  Future<void> deleteAddress(String id);
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final http.Client client;
  final String baseUrl;
  final StorageService storageService;

  AuthRemoteDataSourceImpl({
    required this.client,
    required this.baseUrl,
    required this.storageService,
  });

  Map<String, String> get _headers {
    final token = storageService.getAccessToken();
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  @override
  Future<UserModel> login(String email, String password) async {
    final response = await client.post(
      Uri.parse('https://connectx-9agd.onrender.com/api/auth/login/'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'email': email, 'password': password}),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);

      await storageService.saveAccessToken(data['access']);
      await storageService.saveRefreshToken(data['refresh']);

      final user = UserModel.fromJson(data['user']);
      await storageService.saveUser(user);

      return user;
    } else {
      String message = 'Login failed';
      try {
        final data = json.decode(response.body);
        message = data['detail'] ?? data['message'] ?? 'Unknown login error';
      } catch (e) {
        message = 'Server error: ${response.statusCode}';
      }
      throw ServerException(message);
    }
  }

  @override
  Future<UserModel> signup({
    required String tenant,
    required String name,
    required String email,
    required String password,
    required String role,
  }) async {
    final response = await client.post(
      Uri.parse('https://connectx-9agd.onrender.com/api/users/'),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: json.encode({
        'tenant': tenant,
        'name': name,
        'email': email,
        'password': password,
        'role': role,
      }),
    );

    if (response.statusCode == 201) {
      final data = json.decode(response.body);
      final user = UserModel.fromJson(data);
      return user;
    } else {
      String message = 'Signup failed';
      try {
        final data = json.decode(response.body);
        if (data is Map<String, dynamic>) {
          message = data.entries
              .map(
                (e) =>
                    '${e.key}: ${e.value is List ? e.value.join(', ') : e.value}',
              )
              .join('\n');
        } else {
          message = data.toString();
        }
      } catch (e) {
        message = 'Server error: ${response.statusCode}';
      }
      if (response.statusCode == 400 || response.statusCode == 422) {
        throw ValidationException(message);
      } else {
        throw ServerException(message);
      }
    }
  }

  @override
  Future<void> logout() async {
    await storageService.clearAuthData();
  }

  @override
  Future<List<AddressModel>> getAddresses() async {
    final token = storageService.getAccessToken();

    if (token == null) {
      throw ServerException("User not logged in or token missing.");
    }

    final response = await client.get(
      Uri.parse(
        'https://connectx-9agd.onrender.com/api/shipping-addresses/my_address/',
      ),
      headers: {'Accept': 'application/json', 'Authorization': 'Bearer $token'},
    );

    if (response.statusCode == 200) {
      final List<dynamic> addressesJson = json.decode(response.body);
      final addresses =
          addressesJson.map((json) => AddressModel.fromJson(json)).toList();
      return addresses;
    } else {
      final error = json.decode(response.body);
      throw ServerException(error['message'] ?? 'Failed to fetch addresses');
    }
  }

  @override
  Future<void> addAddress(AddressModel address) async {
    final token = storageService.getAccessToken();

    if (token == null) {
      throw ServerException("User not logged in or token missing.");
    }

    try {
      final response = await client.post(
        Uri.parse('https://connectx-9agd.onrender.com/api/shipping-addresses/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({
          "label": address.label,
          "full_address": address.fullAddress,
          "phone_number": address.phoneNumber,
          "is_default": address.isDefault,
        }),
      );
      print(response.body);
      if (response.statusCode != 201) {
        final error = json.decode(response.body);
        throw ServerException(error['message'] ?? 'Failed to add address');
      }
    } catch (e) {
      print(e);
      rethrow;
    }
  }

  @override
  Future<void> updateAddress(AddressModel address) async {
    final token = storageService.getAccessToken();

    if (token == null) {
      throw ServerException("User not logged in or token missing.");
    }

    final response = await client.put(
      Uri.parse(
        'https://connectx-9agd.onrender.com/api/shipping-addresses/${address.id}/',
      ),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: json.encode(address.toJson()),
    );

    if (response.statusCode != 200) {
      final error = json.decode(response.body);
      throw ServerException(error['message'] ?? 'Failed to update address');
    }
  }

  @override
  Future<void> deleteAddress(String id) async {
    final token = storageService.getAccessToken();

    if (token == null) {
      throw ServerException("User not logged in or token missing.");
    }

    final response = await client.delete(
      Uri.parse(
        'https://connectx-9agd.onrender.com/api/shipping-addresses/$id/',
      ),
      headers: {'Authorization': 'Bearer $token'},
    );

    if (response.statusCode != 204 && response.statusCode != 200) {
      String errorMessage = 'Failed to delete address';
      try {
        final error = json.decode(response.body);
        errorMessage = error['message'] ?? errorMessage;
      } catch (_) {}
      throw ServerException(errorMessage);
    }
  }

  @override
  Future<void> verifyEmail(String email, String otp) async {
    final response = await client.post(
      Uri.parse('https://connectx-9agd.onrender.com/api/auth/email/verify'),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: json.encode({'email': email, 'otp': otp}),
    );
    if (response.statusCode != 200) {
      final error = json.decode(response.body);
      throw ValidationException(error['error'] ?? 'Failed to verify email');
    }
  }

  @override
  Future<void> resendVerification(String email) async {
    final response = await client.post(
      Uri.parse(
        'https://connectx-9agd.onrender.com/api/auth/email/verify/resend',
      ),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: json.encode({'email': email}),
    );

    if (response.statusCode != 200) {
      final error = json.decode(response.body);
      throw ValidationException(
        error['message'] ?? 'Failed to resend verification',
      );
    }
  }

  @override
  Future<UserModel> getUserProfile() async {
    final token = storageService.getAccessToken();
    final user = storageService.getUser();

    if (token == null || user == null) {
      throw ServerException("User not logged in or token/user data missing.");
    }

    final userId = user.id;

    final response = await client.get(
      Uri.parse('https://connectx-9agd.onrender.com/api/users/$userId/'),
      headers: {'Accept': 'application/json', "Authorization": "Bearer $token"},
    );

    if (response.statusCode != 200) {
      String errorMessage = 'Failed to get user profile';
      try {
        final error = json.decode(response.body);
        errorMessage =
            error['detail'] ??
            error['message'] ??
            'Server error: ${response.statusCode}';
      } catch (e) {
        errorMessage =
            'Server error: ${response.statusCode}. Unable to parse error response.';
      }
      if (response.statusCode == 401) {
        throw ServerException(
          "Unauthorized (401): Token may be invalid or expired.",
        );
      } else if (response.statusCode == 404) {
        throw ServerException(
          "Not Found (404): User not found with ID: $userId",
        );
      }
      throw ServerException(errorMessage);
    }

    final profileData = json.decode(response.body);
    final updatedUser = UserModel.fromJson(profileData);

    await storageService.saveUser(updatedUser);

    return updatedUser;
  }
}
