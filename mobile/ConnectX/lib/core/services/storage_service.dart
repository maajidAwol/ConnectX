import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';
import 'package:korecha/features/authentication/data/models/user_model.dart';

class StorageService {
  final SharedPreferences _prefs;

  StorageService(this._prefs);

  static const String ACCESS_TOKEN_KEY = 'access_token';
  static const String REFRESH_TOKEN_KEY = 'refresh_token';
  static const String USER_EMAIL_KEY = 'user_email';
  static const String USER_PASSWORD_KEY = 'user_password';
  static const String HAS_SEEN_ONBOARDING_KEY = 'has_seen_onboarding';
  static const String USER_KEY = 'user';

  // Access Token
  Future<void> saveAccessToken(String token) async {
    await _prefs.setString(ACCESS_TOKEN_KEY, token);
  }

  String? getAccessToken() {
    return _prefs.getString(ACCESS_TOKEN_KEY);
  }

  // Refresh Token
  Future<void> saveRefreshToken(String token) async {
    await _prefs.setString(REFRESH_TOKEN_KEY, token);
  }

  String? getRefreshToken() {
    return _prefs.getString(REFRESH_TOKEN_KEY);
  }

  // User Credentials
  Future<void> saveUserCredentials(String email, String password) async {
    await _prefs.setString(USER_EMAIL_KEY, email);
    await _prefs.setString(USER_PASSWORD_KEY, password);
  }

  String? getUserEmail() {
    return _prefs.getString(USER_EMAIL_KEY);
  }

  String? getUserPassword() {
    return _prefs.getString(USER_PASSWORD_KEY);
  }

  // Check if user is logged in
  bool isUserLoggedIn() {
    return getAccessToken() != null;
  }

  Future<void> saveUser(UserModel user) async {
    final userJson = user.toJson();
    await _prefs.setString(USER_KEY, jsonEncode(userJson));
  }

  UserModel? getUser() {
    final userJson = _prefs.getString(USER_KEY);
    if (userJson == null) return null;

    try {
      final Map<String, dynamic> data = Map<String, dynamic>.from(
        jsonDecode(userJson),
      );
      return UserModel.fromJson(data);
    } catch (e) {
      print("Error parsing user JSON: $e");
      return null;
    }
  }

  // Clear auth data on logout
  Future<void> clearAuthData() async {
    await _prefs.remove(ACCESS_TOKEN_KEY);
    await _prefs.remove(REFRESH_TOKEN_KEY);
    await _prefs.remove(USER_EMAIL_KEY);
    await _prefs.remove(USER_PASSWORD_KEY);
    await _prefs.remove(USER_KEY);
  }

  // Onboarding
  bool hasSeenOnboarding() {
    return _prefs.getBool(HAS_SEEN_ONBOARDING_KEY) ?? false;
  }

  Future<void> setHasSeenOnboarding() async {
    await _prefs.setBool(HAS_SEEN_ONBOARDING_KEY, true);
  }
}
