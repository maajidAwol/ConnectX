import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../../core/error/exceptions.dart';
import '../../../../core/services/storage_service.dart';
import '../../../../core/constants/app_constants.dart';
import '../models/product_model.dart';
import '../models/category_model.dart';

abstract class ProductRemoteDataSource {
  Future<List<ProductModel>> getProducts();
  Future<ProductModel> getProductById(String productId);
  Future<List<CategoryModel>> getProductCategories();
  Future<List<ProductModel>> getProductsByCategoryId(String categoryId);
  Future<List<ProductModel>> getProductBySearch(String query);
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
  Future<List<ProductModel>> getProducts() async {
    try {
      final response = await client.get(
        Uri.parse('$baseUrl/products/'),
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
        Uri.parse('$baseUrl/products/?search=$query'),
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
        Uri.parse('$baseUrl/products/$productId/'),
        headers: _headers,
      );
      print(response.body);
      print(response.statusCode);
      if (response.statusCode == 200) {
        final productJson = json.decode(response.body);
        return ProductModel.fromJson(productJson);
      } else {
        throw ServerException(
          'Failed to load product details: ${response.statusCode}',
        );
      }
    } catch (e) {
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
}
