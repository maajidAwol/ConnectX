import 'dart:convert';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../../../../core/error/exceptions.dart';
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
  final String authToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ2NDczMjA3LCJpYXQiOjE3NDYzODY4MDcsImp0aSI6ImQxOWI3Y2UzZjY5NDQ0ODk4MDU4ZDEzMDRmZTQ0ZDg1IiwidXNlcl9pZCI6ImZkZjdhZDkzLTQxZGItNDhkZS05OGRkLThjMmE1YWNiOGM4NSJ9.2aiGOLx6b-K-eqJkSXgymWnzG7HXHK25VN_iguLhq8g';

  ProductRemoteDataSourceImpl({required this.client, required this.baseUrl});

  @override
  Future<List<ProductModel>> getProducts() async {
    try {
      final response = await client.get(
        Uri.parse('https://connectx-9agd.onrender.com/api/products/'),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $authToken',
        },
      );

      if (response.statusCode == 200) {
        final decodedResponse = json.decode(response.body);

        // The API returns a paginated response with 'results' field
        List<dynamic> productsJson =
            decodedResponse['results'] as List<dynamic>;

        return productsJson.map((json) {
          try {
            // Transform API response to match our ProductModel structure
            final Map<String, dynamic> transformedJson = {
              'id': json['id'],
              'name': json['name'],
              'sku': json['sku'],
              'code': json['sku'],
              'description': json['description'],
              'subDescription': json['short_description'] ?? '',
              'publish': json['is_public'] ? 'published' : 'draft',
              'price': double.parse(json['selling_price']),
              'priceSale': null,
              'taxes': 0.0,
              'coverUrl': json['cover_url'],
              'tags':
                  json['tag'] is List
                      ? (json['tag'] as List).map((e) => e.toString()).toList()
                      : [],
              'sizes':
                  json['sizes'] is List
                      ? (json['sizes'] as List)
                          .map((e) => e.toString())
                          .toList()
                      : [],
              'colors':
                  json['colors'] is List
                      ? (json['colors'] as List)
                          .map((e) => e.toString())
                          .toList()
                      : [],
              'gender': [],
              'inventoryType':
                  json['quantity'] > 0 ? 'in_stock' : 'out_of_stock',
              'quantity': json['quantity'],
              'available': json['quantity'],
              'totalSold': json['total_sold'],
              'totalRatings': json['total_ratings'].toDouble(),
              'totalReviews': json['total_reviews'],
              'images': json['images'],
              'vendor': {},
              'category': json['category']['name'],
              'reviews': [],
              'ratings': [],
              'newLabel': {'enabled': false},
              'saleLabel': {'enabled': false},
              'createdAt': json['created_at'],
              'brand': {'name': json['brand'] ?? ''},
              'additional_info': json['additional_info'],
            };

            return ProductModel.fromJson(transformedJson);
          } catch (e) {
            print('Error parsing product: $e');
            print('Product JSON: $json');
            rethrow;
          }
        }).toList();
      } else {
        throw ServerException('Failed to load products');
      }
    } catch (e) {
      print('Error fetching products: $e');
      throw ServerException(e.toString());
    }
  }

  @override
  Future<List<ProductModel>> getProductBySearch(String query) async {
    try {
      final response = await client.get(
        Uri.parse(
          'https://connectx-9agd.onrender.com/api/products/?search=$query',
        ),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $authToken',
        },
      );

      if (response.statusCode == 200) {
        final decodedResponse = json.decode(response.body);
        List<dynamic> productsJson =
            decodedResponse['results'] as List<dynamic>;

        return productsJson.map((json) {
          try {
            // Transform API response to match our ProductModel structure
            final Map<String, dynamic> transformedJson = {
              'id': json['id'],
              'name': json['name'],
              'sku': json['sku'],
              'code': json['sku'],
              'description': json['description'],
              'subDescription': json['short_description'] ?? '',
              'publish': json['is_public'] ? 'published' : 'draft',
              'price': double.parse(json['selling_price']),
              'priceSale': null,
              'taxes': 0.0,
              'coverUrl': json['cover_url'],
              'tags':
                  json['tag'] is List
                      ? (json['tag'] as List).map((e) => e.toString()).toList()
                      : [],
              'sizes':
                  json['sizes'] is List
                      ? (json['sizes'] as List)
                          .map((e) => e.toString())
                          .toList()
                      : [],
              'colors':
                  json['colors'] is List
                      ? (json['colors'] as List)
                          .map((e) => e.toString())
                          .toList()
                      : [],
              'gender': [],
              'inventoryType':
                  json['quantity'] > 0 ? 'in_stock' : 'out_of_stock',
              'quantity': json['quantity'],
              'available': json['quantity'],
              'totalSold': json['total_sold'],
              'totalRatings': json['total_ratings'].toDouble(),
              'totalReviews': json['total_reviews'],
              'images': json['images'],
              'vendor': {},
              'category': json['category']['name'],
              'reviews': [],
              'ratings': [],
              'newLabel': {'enabled': false},
              'saleLabel': {'enabled': false},
              'createdAt': json['created_at'],
              'brand': {'name': json['brand'] ?? ''},
              'additional_info': json['additional_info'],
            };

            return ProductModel.fromJson(transformedJson);
          } catch (e) {
            print('Error parsing product: $e');
            print('Product JSON: $json');
            rethrow;
          }
        }).toList();
      } else {
        throw ServerException('Failed to load products by search');
      }
    } catch (e) {
      throw ServerException(e.toString());
    }
  }

  @override
  Future<ProductModel> getProductById(String productId) async {
    try {
      final response = await client.get(
        Uri.parse(
          'https://connectx-9agd.onrender.com/api/products/$productId/',
        ),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $authToken',
        },
      );

      if (response.statusCode == 200) {
        final json = jsonDecode(response.body);

        // Transform API response to match our ProductModel structure
        final Map<String, dynamic> transformedJson = {
          'id': json['id'],
          'name': json['name'],
          'sku': json['sku'],
          'code': json['sku'],
          'description': json['description'],
          'subDescription': json['short_description'] ?? '',
          'publish': json['is_public'] ? 'published' : 'draft',
          'price': double.parse(json['selling_price']),
          'priceSale': null,
          'taxes': 0.0,
          'coverUrl': json['cover_url'],
          'tags':
              json['tag'] is List
                  ? (json['tag'] as List).map((e) => e.toString()).toList()
                  : [],
          'sizes':
              json['sizes'] is List
                  ? (json['sizes'] as List).map((e) => e.toString()).toList()
                  : [],
          'colors':
              json['colors'] is List
                  ? (json['colors'] as List).map((e) => e.toString()).toList()
                  : [],
          'gender': [],
          'inventoryType': json['quantity'] > 0 ? 'in_stock' : 'out_of_stock',
          'quantity': json['quantity'],
          'available': json['quantity'],
          'totalSold': json['total_sold'],
          'totalRatings': json['total_ratings'].toDouble(),
          'totalReviews': json['total_reviews'],
          'images': json['images'],
          'vendor': {},
          'category': json['category']['name'],
          'reviews': [],
          'ratings': [],
          'newLabel': {'enabled': false},
          'saleLabel': {'enabled': false},
          'createdAt': json['created_at'],
          'brand': {'name': json['brand'] ?? ''},
          'additional_info': json['additional_info'],
        };

        final result = ProductModel.fromJson(transformedJson);
        return result;
      } else {
        throw ServerException('Failed to load product');
      }
    } catch (e) {
      throw ServerException(e.toString());
    }
  }

  // Get a random icon when icon is null
  IconData getRandomIcon() {
    final List<IconData> icons = [
      Icons.category,
      Icons.shopping_bag,
      Icons.store,
      Icons.inventory_2,
      Icons.local_mall,
      Icons.format_paint,
      Icons.home,
      Icons.devices,
      Icons.chair,
      Icons.fitness_center,
    ];

    final random = Random();
    return icons[random.nextInt(icons.length)];
  }

  @override
  Future<List<CategoryModel>> getProductCategories() async {
    try {
      final response = await client.get(
        Uri.parse('https://connectx-9agd.onrender.com/api/categories/'),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $authToken',
        },
      );

      print(response.headers);
      print(response.body);

      if (response.statusCode == 200) {
        final decodedResponse = json.decode(response.body);
        final categoriesJson = decodedResponse['results'] as List<dynamic>;

        final categoriesList =
            categoriesJson.map<CategoryModel>((json) {
              // Create a new map with the expected format for CategoryModel
              final Map<String, dynamic> categoryMap = {
                'id': json['id'],
                'name': json['name'],
                'slug': json['name'].toString().toLowerCase().replaceAll(
                  ' ',
                  '-',
                ),
                'group': 'default',
                'description': json['description'],
                'coverImg': json['icon'], // Pass null directly
                'isActive': true,
                'children': [],
                'createdAt': json['created_at'],
                'updatedAt': json['updated_at'],
              };

              return CategoryModel.fromJson(categoryMap);
            }).toList();

        return categoriesList;
      } else {
        throw ServerException('Failed to load product categories');
      }
    } catch (e) {
      throw ServerException(e.toString());
    }
  }

  @override
  Future<List<ProductModel>> getProductsByCategoryId(String categoryId) async {
    try {
      final response = await client.get(
        Uri.parse(
          'https://connectx-9agd.onrender.com/api/products/?category=$categoryId',
        ),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $authToken',
        },
      );

      if (response.statusCode == 200) {
        final decodedResponse = json.decode(response.body);
        List<dynamic> productsJson =
            decodedResponse['results'] as List<dynamic>;

        return productsJson.map((json) {
          try {
            // Transform API response to match our ProductModel structure
            final Map<String, dynamic> transformedJson = {
              'id': json['id'],
              'name': json['name'],
              'sku': json['sku'],
              'code': json['sku'],
              'description': json['description'],
              'subDescription': json['short_description'] ?? '',
              'publish': json['is_public'] ? 'published' : 'draft',
              'price': double.parse(json['selling_price']),
              'priceSale': null,
              'taxes': 0.0,
              'coverUrl': json['cover_url'],
              'tags':
                  json['tag'] is List
                      ? (json['tag'] as List).map((e) => e.toString()).toList()
                      : [],
              'sizes':
                  json['sizes'] is List
                      ? (json['sizes'] as List)
                          .map((e) => e.toString())
                          .toList()
                      : [],
              'colors':
                  json['colors'] is List
                      ? (json['colors'] as List)
                          .map((e) => e.toString())
                          .toList()
                      : [],
              'gender': [],
              'inventoryType':
                  json['quantity'] > 0 ? 'in_stock' : 'out_of_stock',
              'quantity': json['quantity'],
              'available': json['quantity'],
              'totalSold': json['total_sold'],
              'totalRatings': json['total_ratings'].toDouble(),
              'totalReviews': json['total_reviews'],
              'images': json['images'],
              'vendor': {},
              'category': json['category']['name'],
              'reviews': [],
              'ratings': [],
              'newLabel': {'enabled': false},
              'saleLabel': {'enabled': false},
              'createdAt': json['created_at'],
              'brand': {'name': json['brand'] ?? ''},
              'additional_info': json['additional_info'],
            };

            return ProductModel.fromJson(transformedJson);
          } catch (e) {
            print('Error parsing product: $e');
            print('Product JSON: $json');
            rethrow;
          }
        }).toList();
      } else {
        throw ServerException('Failed to load products by category id');
      }
    } catch (e) {
      throw ServerException(e.toString());
    }
  }
}
