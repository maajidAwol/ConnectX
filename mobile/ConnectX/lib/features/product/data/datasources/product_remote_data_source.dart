import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../../core/error/exceptions.dart';
import '../../../../core/services/storage_service.dart';
import '../../../../core/constants/app_constants.dart';
import '../models/product_model.dart';
import '../models/category_model.dart';
import '../models/review_model.dart';

abstract class ProductRemoteDataSource {
  Future<List<ProductModel>> getProducts({int page = 1, int pageSize = 20});
  Future<ProductModel> getProductById(String productId);
  Future<List<CategoryModel>> getProductCategories();
  Future<List<ProductModel>> getProductsByCategoryId(String categoryId);
  Future<List<ProductModel>> getProductBySearch(String query);

  // New methods for better product filtering
  Future<List<ProductModel>> getProductsWithPagination({
    int page = 1,
    int pageSize = 20,
  });
  Future<List<ProductModel>> getAllProductsAcrossPages({int maxPages = 3});

  // Review methods
  Future<ReviewModel> createReview({
    required String productId,
    required int rating,
    required String comment,
    String? title,
  });
  Future<List<ReviewModel>> getProductReviews(String productId);
}

class ProductRemoteDataSourceImpl implements ProductRemoteDataSource {
  final http.Client client;
  final String baseUrl;
  final StorageService storageService;

  ProductRemoteDataSourceImpl({
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
  Future<List<ProductModel>> getProducts({
    int page = 1,
    int pageSize = 20,
  }) async {
    try {
      final response = await client.get(
        Uri.parse(
          '$baseUrl/products/?filter_type=listed&page=$page&page_size=$pageSize',
        ),
        headers: _headers,
      );
      print(response.body);
      print(response.statusCode);
      if (response.statusCode == 200) {
        final decodedResponse = json.decode(response.body);

        // New API returns paginated results with 'results' field
        final List<dynamic> productsJson = decodedResponse['results'];

        return productsJson.map((json) => ProductModel.fromJson(json)).toList();
      } else {
        throw ServerException(
          'Failed to load products: ${response.statusCode}',
        );
      }
    } catch (e) {
      throw ServerException(e.toString());
    }
  }

  @override
  Future<List<ProductModel>> getProductBySearch(String query) async {
    try {
      final response = await client.get(
        Uri.parse('$baseUrl/products/?filter_type=listed&search=$query'),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        final decodedResponse = json.decode(response.body);
        final List<dynamic> productsJson = decodedResponse['results'];

        return productsJson.map((json) => ProductModel.fromJson(json)).toList();
      } else {
        throw ServerException('Failed to load products by search');
      }
    } catch (e) {
      throw ServerException(e.toString());
    }
  }

  @override
  Future<ProductModel> getProductById(String productId) async {
    print("getProductById");
    print(productId);
    try {
      final response = await client.get(
        Uri.parse('$baseUrl/products/?filter_type=listed&id=$productId/'),
        headers: _headers,
      );
      print(response.body);
      print(response.statusCode);
      if (response.statusCode == 200) {
        final decodedResponse = json.decode(response.body);

        // Handle paginated response - extract the first product from results
        if (decodedResponse is Map<String, dynamic> &&
            decodedResponse.containsKey('results') &&
            decodedResponse['results'] is List &&
            (decodedResponse['results'] as List).isNotEmpty) {
          final productJson = (decodedResponse['results'] as List).first;
          print(
            'ProductRemoteDataSource: Extracted product from results: $productJson',
          );
          return ProductModel.fromJson(productJson);
        } else {
          throw ServerException('No product found with ID: $productId');
        }
      } else {
        throw ServerException(
          'Failed to load product details: ${response.statusCode}',
        );
      }
    } catch (e) {
      print('Error in getProductById: $e');
      throw ServerException(e.toString());
    }
  }

  @override
  Future<List<CategoryModel>> getProductCategories() async {
    print("getProductCategories");
    print(baseUrl);

    try {
      final response = await client.get(
        Uri.parse('$baseUrl/products/listed-categories/'),
        headers: _headers,
      );
      print(response.body);
      print(response.statusCode);
      if (response.statusCode == 200) {
        final decodedResponse = json.decode(response.body);
        List<dynamic> categoriesJson;

        // Handle both paginated and non-paginated response
        if (decodedResponse is Map<String, dynamic> &&
            decodedResponse.containsKey('results')) {
          categoriesJson = decodedResponse['results'] as List<dynamic>;
        } else if (decodedResponse is List) {
          categoriesJson = decodedResponse;
        } else {
          categoriesJson = [];
        }

        return categoriesJson
            .map((json) => CategoryModel.fromJson(json))
            .toList();
      } else {
        throw ServerException(
          'Failed to load product categories: ${response.statusCode}',
        );
      }
    } catch (e) {
      throw ServerException(e.toString());
    }
  }

  @override
  Future<List<ProductModel>> getProductsByCategoryId(String categoryId) async {
    try {
      final response = await client.get(
        Uri.parse('$baseUrl/products/by-category/$categoryId/'),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        final List<dynamic> productsJson = json.decode(response.body);

        return productsJson.map((json) => ProductModel.fromJson(json)).toList();
      } else {
        throw ServerException(
          'Failed to load products by category: ${response.statusCode}',
        );
      }
    } catch (e) {
      throw ServerException(e.toString());
    }
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

      print('Creating review with body: ${json.encode(body)}');

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
        // Try to extract error message from response
        String errorMessage = 'Failed to create review: ${response.statusCode}';
        try {
          final errorResponse = json.decode(response.body);
          if (errorResponse is Map<String, dynamic>) {
            if (errorResponse.containsKey('detail')) {
              errorMessage = errorResponse['detail'].toString();
            } else if (errorResponse.containsKey('error')) {
              errorMessage = errorResponse['error'].toString();
            } else if (errorResponse.containsKey('message')) {
              errorMessage = errorResponse['message'].toString();
            }
          }
        } catch (e) {
          // If JSON parsing fails, use the original error message
          print('Failed to parse error response: $e');
        }

        throw ServerException(errorMessage);
      }
    } catch (e) {
      if (e is ServerException) {
        rethrow; // Re-throw ServerException with the proper message
      }
      print('Error creating review: $e');
      throw ServerException(e.toString());
    }
  }

  @override
  Future<List<ReviewModel>> getProductReviews(String productId) async {
    try {
      final response = await client.get(
        Uri.parse('$baseUrl/reviews/product-reviews/?product_id=$productId'),
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
      print('Error getting reviews: $e');
      throw ServerException(e.toString());
    }
  }

  @override
  Future<List<ProductModel>> getProductsWithPagination({
    int page = 1,
    int pageSize = 20,
  }) async {
    try {
      final response = await client.get(
        Uri.parse(
          '$baseUrl/products/?filter_type=listed&page=$page&page_size=$pageSize',
        ),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        final decodedResponse = json.decode(response.body);
        final List<dynamic> productsJson = decodedResponse['results'];
        return productsJson.map((json) => ProductModel.fromJson(json)).toList();
      } else {
        throw ServerException(
          'Failed to load products: ${response.statusCode}',
        );
      }
    } catch (e) {
      throw ServerException(e.toString());
    }
  }

  @override
  Future<List<ProductModel>> getAllProductsAcrossPages({
    int maxPages = 3,
  }) async {
    List<ProductModel> allProducts = [];

    try {
      for (int page = 1; page <= maxPages; page++) {
        final response = await client.get(
          Uri.parse(
            '$baseUrl/products/?filter_type=listed&page=$page&page_size=20',
          ),
          headers: _headers,
        );

        if (response.statusCode == 200) {
          final decodedResponse = json.decode(response.body);
          final List<dynamic> productsJson = decodedResponse['results'];
          final products =
              productsJson.map((json) => ProductModel.fromJson(json)).toList();

          allProducts.addAll(products);

          // Check if there are more pages
          if (decodedResponse['next'] == null) {
            break; // No more pages
          }
        } else {
          print('Failed to load page $page: ${response.statusCode}');
          break; // Stop on error
        }

        // Add a small delay to avoid overwhelming the server
        await Future.delayed(const Duration(milliseconds: 100));
      }

      return allProducts;
    } catch (e) {
      throw ServerException(e.toString());
    }
  }
}
