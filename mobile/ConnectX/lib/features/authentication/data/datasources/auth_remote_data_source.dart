import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../../core/error/exceptions.dart';
import '../../../../core/services/storage_service.dart';
import '../models/user_model.dart';
import '../models/address_model.dart';

abstract class AuthRemoteDataSource {
  Future<UserModel> login(String email, String password);
  Future<bool> signup(
    String email,
    String password,
    String confirmPassword,
    String firstName,
    String lastName,
    String phone,
    String sex,
    String address,
    bool agreement,
  );
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
      Uri.parse('https://api.korecha.com.et/api/auth/sign-in'),
      body: json.encode({
        'identifier': email,
        'password': password,
      }),
      headers: {'Content-Type': 'application/json'},
    );
    // print(response.body);
    // print(response.statusCode);

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      // Save credentials and token

      await storageService.saveUserCredentials(email, password);
      await storageService.saveAccessToken(data['accessToken']);

      final user = UserModel.fromJson(data);
      await storageService.saveUser(user);

      return user;
    } else if (response.statusCode == 203) {
      final data = json.decode(response.body);
      if (data['status'] == 'verification_required') {
        throw VerificationRequiredException(
          message: data['message'],
          email: email,
          accessToken: data['accessToken'],
        );
      }
      return UserModel.fromJson(data);
    } else {
      final data = json.decode(response.body);
      String message = data['message'] ?? 'Server error';
      throw ServerException(message);
    }
  }

  @override
  Future<bool> signup(
    String email,
    String password,
    String confirmPassword,
    String firstName,
    String lastName,
    String phone,
    String sex,
    String address,
    bool agreement,
  ) async {
    final response = await client.post(
      Uri.parse('https://api.korecha.com.et/api/auth/sign-up'),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: json.encode({
        'role': 'customer',
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'phone': phone,
        'sex': sex,
        'address': address,
        'password': password,
        'confirmPassword': confirmPassword,
        'agreement': agreement,
      }),
    ); 

    if (response.statusCode == 201) {

      // print(response.body);
      final data = json.decode(response.body);
      // Save credentials and token
      // await storageService.saveUserCredentials(email, password);
      // await storageService.saveAccessToken(data['accessToken']);
      if (data['success'] == true) {
        return true;
      } else {
        return false;
      }
    } else if (response.statusCode == 422) {
      final error = json.decode(response.body);
      throw ValidationException(
          error['message'] ?? 'Validation error occurred');
    } else {
      final data = json.decode(response.body);
      String message = data['message'] ?? 'Server error';
      throw ServerException(message);
    }
  }

  @override
  Future<void> logout() async {
    await storageService.clearAuthData();
  }

  @override
  Future<List<AddressModel>> getAddresses() async {
    final token = storageService.getAccessToken();
    final user = await getUserProfile();

    // Create primary address from user profile if it has an address
    List<AddressModel> addresses = [];
    if (user.address.isNotEmpty == true) {
      addresses.add(AddressModel(
        id: 'profile',
        fullAddress: user.address,
        primary: true,
        phoneNumber: user.phoneNumber ?? '',
        addressType: 'home',
      ));
    }

    final userId = user.id;
    final response = await client.get(
      Uri.parse('https://api.korecha.com.et/api/user/$userId/addresses'),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final List<dynamic> addressesJson = json.decode(response.body);
      final additionalAddresses = addressesJson
          .map((json) => AddressModel.fromJson(json))
          .where((addr) => addr.id != 'profile') // Exclude duplicates
          .toList();

      addresses.addAll(additionalAddresses);
      return addresses;
    } else {
      final error = json.decode(response.body);
      throw ServerException(error['message'] ?? 'Failed to fetch addresses');
    }
  }

  @override
  Future<void> addAddress(AddressModel address) async {
    final token = storageService.getAccessToken();
    final user = await getUserProfile();
    final userId = user.id;
    try {
      final response = await client.post(
        Uri.parse(
            'https://api.korecha.com.et/api/user/$userId/addresses/create'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({
          "fullAddress": address.fullAddress,
          "addressType": "home",
          "primary": false
        }),
      );

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
    const userId = '1'; // TODO: Get actual user ID
    final response = await client.put(
      Uri.parse(
          'https://api.korecha.com.et/api/user/$userId/addresses/${address.id}'),
      headers: _headers,
      body: json.encode(address.toJson()),
    );

    if (response.statusCode != 200) {
      final error = json.decode(response.body);
      throw ServerException(error['message'] ?? 'Failed to update address');
    }
  }

  @override
  Future<void> deleteAddress(String id) async {
    const userId = '1'; // TODO: Get actual user ID
    final response = await client.delete(
      Uri.parse('https://api.korecha.com.et/api/user/$userId/addresses/$id'),
      headers: _headers,
    );

    if (response.statusCode != 200) {
      final error = json.decode(response.body);
      throw ServerException(error['message'] ?? 'Failed to delete address');
    }
  }

  // @override
  // Future<UserModel> getCurrentUser() async {
  //   // Implementation needed
  //   throw UnimplementedError();
  // }

  @override
  Future<void> verifyEmail(String email, String otp) async {
    final response = await client.post(
      Uri.parse('$baseUrl/auth/email/verify'),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: json.encode({
        'email': email,
        'otp': otp,
      }),
    );
    // print(response.statusCode);
    // print(response.body);
    if (response.statusCode != 200) {
      final error = json.decode(response.body);
      throw ValidationException(error['error'] ?? 'Failed to verify email');
    }
  }

  @override
  Future<void> resendVerification(String email) async {
    final response = await client.post(
      Uri.parse('$baseUrl/auth/email/verify/resend'),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: json.encode({'email': email}),
    );

    if (response.statusCode != 200) {
      final error = json.decode(response.body);
      throw ValidationException(
          error['message'] ?? 'Failed to resend verification');
    }
  }

  @override
  Future<UserModel> getUserProfile() async {
    final token = storageService.getAccessToken();

    final response = await client.get(
      Uri.parse('https://api.korecha.com.et/api/auth/me'),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "Authorization": "Bearer $token",
      },
    );

    if (response.statusCode != 200) {
      final error = json.decode(response.body);
      throw ValidationException(error['error'] ?? 'Failed to get user profile');
    }
    return UserModel.fromJson(json.decode(response.body));
  }
}
