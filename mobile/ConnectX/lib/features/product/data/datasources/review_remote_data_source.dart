import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../../core/error/exceptions.dart';
import '../../../../core/services/storage_service.dart';
import '../../../../core/constants/app_constants.dart';
import '../models/review_model.dart';

abstract class ReviewRemoteDataSource {
  Future<ReviewModel> createReview({
    required String productId,
    required int rating,
    required String comment,
    String? title,
  });
  Future<List<ReviewModel>> getProductReviews(String productId);
}

class ReviewRemoteDataSourceImpl implements ReviewRemoteDataSource {
  final http.Client client;
  final String baseUrl;
  final StorageService storageService;

  ReviewRemoteDataSourceImpl({
    required this.client,
    required this.baseUrl,
    required this.storageService,
  });

  Map<String, String> get _headers {
    final token = storageService.getAccessToken();
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-API-KEY': API_KEY,
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  @override
  Future<ReviewModel> createReview({
    required String productId,
    required int rating,
    required String comment,
    String? title,
  }) async {
    try {
      final body = {
        'product': productId,
        'rating': rating,
        'comment': comment,
        if (title != null && title.isNotEmpty) 'title': title,
      };

      final response = await client.post(
        Uri.parse('$baseUrl/reviews/'),
        headers: _headers,
        body: json.encode(body),
      );

      print('Create review response: ${response.body}');
      print('Create review status: ${response.statusCode}');

      if (response.statusCode == 201 || response.statusCode == 200) {
        final reviewJson = json.decode(response.body);
        return ReviewModel.fromJson(reviewJson);
      } else {
        throw ServerException(
          'Failed to create review: ${response.statusCode}',
        );
      }
    } catch (e) {
      throw ServerException(e.toString());
    }
  }

  @override
  Future<List<ReviewModel>> getProductReviews(String productId) async {
    try {
      final response = await client.get(
        Uri.parse('$baseUrl/reviews/?product=$productId'),
        headers: _headers,
      );

      print('Get reviews response: ${response.body}');
      print('Get reviews status: ${response.statusCode}');

      if (response.statusCode == 200) {
        final decodedResponse = json.decode(response.body);
        List<dynamic> reviewsJson;

        // Handle both paginated and non-paginated response
        if (decodedResponse is Map<String, dynamic> &&
            decodedResponse.containsKey('results')) {
          reviewsJson = decodedResponse['results'] as List<dynamic>;
        } else if (decodedResponse is List) {
          reviewsJson = decodedResponse;
        } else {
          reviewsJson = [];
        }

        return reviewsJson.map((json) => ReviewModel.fromJson(json)).toList();
      } else {
        throw ServerException('Failed to load reviews: ${response.statusCode}');
      }
    } catch (e) {
      throw ServerException(e.toString());
    }
  }
}
