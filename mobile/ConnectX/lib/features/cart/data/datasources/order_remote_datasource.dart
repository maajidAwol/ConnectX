import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:korecha/core/error/exceptions.dart';
import 'package:korecha/core/services/storage_service.dart';
import 'package:korecha/core/constants/app_constants.dart';
import 'package:korecha/features/authentication/data/models/user_model.dart';
import 'package:korecha/features/cart/data/models/cod_order_request_model.dart';
import 'package:korecha/features/cart/data/models/cod_order_response.dart';
import 'package:korecha/features/cart/data/models/my_orders_model.dart';
import '../models/chapa_order_request_model.dart';
import '../models/chapa_order_response_model.dart';

abstract class OrderRemoteDataSource {
  /// Creates an order with Chapa payment
  /// Throws a [ServerException] for all error codes.
  Future<ChapaOrderResponse> createChapaOrder(ChapaOrderModel order);

  /// Creates an order with Cash on Delivery
  /// Throws a [ServerException] for all error codes.
  Future<CashOnDeliveryResponse> createCashOnDeliveryOrder(
    CashOnDeliveryOrder order,
  );

  /// Gets all orders for the current user
  /// Throws a [ServerException] for all error codes.
  Future<MyOrdersModel> getOrders();

  /// Gets the current user's profile
  /// Throws a [ServerException] for all error codes.
  Future<UserModel> getUserProfile();
}

class OrderRemoteDataSourceImpl implements OrderRemoteDataSource {
  final http.Client client;
  final StorageService storageService;
  final String baseUrl;

  OrderRemoteDataSourceImpl({
    required this.client,
    required this.storageService,
    required this.baseUrl,
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
  Future<ChapaOrderResponse> createChapaOrder(ChapaOrderModel order) async {
    final token = storageService.getAccessToken();
    if (token == null) {
      throw ServerException('Authentication token not found');
    }

    // Convert Chapa order model to the new API format
    final Map<String, dynamic> orderData = {
      "status": "processing", // Set to processing for Chapa as it's successful
      "subtotal": order.subtotal.toString(),
      "taxes": "0.00", // Provide default if not available
      "shipping": order.delivery.fee.toString(),
      "discount": order.discount.toString(),
      "notes": "Payment via Chapa",
      "email": order.billing.email,
      "phone": order.billing.phoneNumber,
      "shipping_address":
          order.shipping.address, // This should be an address ID
      "items":
          order.items
              .map(
                (item) => {
                  "product": item.id,
                  "quantity": item.quantity,
                  "price": item.price.toString(),
                },
              )
              .toList(),
    };
    print("createChapaOrder");
    final response = await client.post(
      Uri.parse('$baseUrl/orders/'),
      headers: _headers,
      body: jsonEncode(orderData),
    );

    print("Chapa order creation response:");
    print(response.body);
    print(response.statusCode);

    if (response.statusCode == 201 || response.statusCode == 200) {
      return ChapaOrderResponse.fromJson(jsonDecode(response.body));
    } else {
      throw ServerException(
        'Failed to create order with Chapa: ${response.body}',
      );
    }
  }

  @override
  Future<CashOnDeliveryResponse> createCashOnDeliveryOrder(
    CashOnDeliveryOrder order,
  ) async {
    final token = storageService.getAccessToken();

    if (token == null) {
      throw ServerException('Authentication token not found');
    }

    // Convert COD order model to the new API format
    final Map<String, dynamic> orderData = {
      "status": "pending", // Set to pending for Cash on Delivery
      "subtotal": order.subtotal.toString(),
      "taxes": "0.00", // Provide default if not available
      "shipping": "0.00", // Extract from order if available
      "discount": "0.00", // Extract from order if available
      "notes": order.notes ?? "Cash on Delivery",
      "email": order.billing.email,
      "phone": order.billing.phoneNumber,
      "shipping_address":
          order.shipping.address, // This should be an address ID
      "items":
          order.items
              .map(
                (item) => {
                  "product": item.id,
                  "quantity": item.quantity,
                  "price": item.price.toString(),
                },
              )
              .toList(),
    };

    final response = await client.post(
      Uri.parse('$baseUrl/orders/'),
      headers: _headers,
      body: jsonEncode(orderData),
    );

    print("COD order creation response:");
    print(response.body);
    print(response.statusCode);

    if (response.statusCode == 201 || response.statusCode == 200) {
      return CashOnDeliveryResponse.fromJson(jsonDecode(response.body));
    } else {
      throw ServerException(
        'Failed to create order with Cash on Delivery: ${response.body}',
      );
    }
  }

  @override
  Future<MyOrdersModel> getOrders() async {
    final token = storageService.getAccessToken();

    if (token == null) {
      throw ServerException('Authentication token not found');
    }

    final response = await client.get(
      Uri.parse('$baseUrl/orders/my-orders/'),
      headers: _headers,
    );

    print("Get orders response:");
    print(response.body);
    print(response.statusCode);

    if (response.statusCode == 200) {
      final jsonResponse = jsonDecode(response.body);
      return MyOrdersModel.fromJson(jsonResponse);
    } else {
      throw ServerException('Failed to get user orders: ${response.body}');
    }
  }

  @override
  Future<UserModel> getUserProfile() async {
    final token = storageService.getAccessToken();

    final response = await client.get(
      Uri.parse('$baseUrl/auth/me/'),
      headers: _headers,
    );

    if (response.statusCode != 200) {
      final error = json.decode(response.body);
      throw ValidationException(error['error'] ?? 'Failed to get user profile');
    }
    return UserModel.fromJson(json.decode(response.body));
  }
}
