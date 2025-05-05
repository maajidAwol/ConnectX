// class OrderResponseModel {
//   final String status;
//   final String message;
//   final OrderDataModel? data;
//   final OrderModel? order;

//   OrderResponseModel({
//     required this.status,
//     required this.message,
//     this.data,
//     this.order,
//   });

//   factory OrderResponseModel.fromJson(Map<String, dynamic> json) {
//     return OrderResponseModel(
//       status: json['status'],
//       message: json['message'] ?? '',
//       data: json['data'] != null ? OrderDataModel.fromJson(json['data']) : null,
//       order: json['order'] != null ? OrderModel.fromJson(json['order']) : null,
//     );
//   }
// }

// class OrderDataModel {
//   final int orderId;
//   final String orderNumber;
//   final String? invoiceNumber;
//   final double total;
//   final String status;
//   final String createdAt;

//   OrderDataModel({
//     required this.orderId,
//     required this.orderNumber,
//     this.invoiceNumber,
//     required this.total,
//     required this.status,
//     required this.createdAt,
//   });

//   factory OrderDataModel.fromJson(Map<String, dynamic> json) {
//     return OrderDataModel(
//       orderId: json['order_id'],
//       orderNumber: json['order_number'],
//       invoiceNumber: json['invoice_number'],
//       total: double.parse(json['total'].toString()),
//       status: json['status'],
//       createdAt: json['created_at'],
//     );
//   }
// }

// class OrderModel {
//   final int id;
//   final int userId;
//   final double taxes;
//   final String status;
//   final double shipping;
//   final double discount;
//   final double subtotal;
//   final String orderNumber;
//   final double totalAmount;
//   final int totalQuantity;
//   final String updatedAt;
//   final String createdAt;
//   final List<OrderItemDetailsModel> items;
//   final CustomerModel? customer;
//   final ShippingAddressModel? shippingAdd;

//   OrderModel({
//     required this.id,
//     required this.userId,
//     required this.taxes,
//     required this.status,
//     required this.shipping,
//     required this.discount,
//     required this.subtotal,
//     required this.orderNumber,
//     required this.totalAmount,
//     required this.totalQuantity,
//     required this.updatedAt,
//     required this.createdAt,
//     required this.items,
//     this.customer,
//     this.shippingAdd,
//   });

//   factory OrderModel.fromJson(Map<String, dynamic> json) {
//     return OrderModel(
//       id: json['id'],
//       userId: json['user_id'],
//       taxes: double.parse(json['taxes'].toString()),
//       status: json['status'],
//       shipping: double.parse(json['shipping'].toString()),
//       discount: double.parse(json['discount'].toString()),
//       subtotal: double.parse(json['subtotal'].toString()),
//       orderNumber: json['order_number'],
//       totalAmount: double.parse(json['total_amount'].toString()),
//       totalQuantity: json['total_quantity'],
//       updatedAt: json['updated_at'],
//       createdAt: json['created_at'],
//       items: json['items'] != null
//           ? List<OrderItemDetailsModel>.from(
//               json['items'].map((item) => OrderItemDetailsModel.fromJson(item)))
//           : [],
//       customer: json['customer'] != null
//           ? CustomerModel.fromJson(json['customer'])
//           : null,
//       shippingAdd: json['shipping_add'] != null
//           ? ShippingAddressModel.fromJson(json['shipping_add'])
//           : null,
//     );
//   }
// }

// class OrderItemDetailsModel {
//   final int id;
//   final int orderId;
//   final String name;
//   final double price;
//   final int quantity;
//   final String? imageUrl;
//   final String? createdAt;
//   final String? updatedAt;

//   OrderItemDetailsModel({
//     required this.id,
//     required this.orderId,
//     required this.name,
//     required this.price,
//     required this.quantity,
//     this.imageUrl,
//     this.createdAt,
//     this.updatedAt,
//   });

//   factory OrderItemDetailsModel.fromJson(Map<String, dynamic> json) {
//     return OrderItemDetailsModel(
//       id: json['id'],
//       orderId: json['order_id'],
//       name: json['name'],
//       price: double.parse(json['price'].toString()),
//       quantity: json['quantity'],
//       imageUrl: json['image_url'],
//       createdAt: json['created_at'],
//       updatedAt: json['updated_at'],
//     );
//   }
// }

// class CustomerModel {
//   final int id;
//   final int orderId;
//   final String name;
//   final String email;
//   final String? avatarUrl;
//   final String? ipAddress;
//   final String fullAddress;
//   final String phoneNumber;
//   final String? company;
//   final String? addressType;
//   final String createdAt;
//   final String updatedAt;

//   CustomerModel({
//     required this.id,
//     required this.orderId,
//     required this.name,
//     required this.email,
//     this.avatarUrl,
//     this.ipAddress,
//     required this.fullAddress,
//     required this.phoneNumber,
//     this.company,
//     this.addressType,
//     required this.createdAt,
//     required this.updatedAt,
//   });

//   factory CustomerModel.fromJson(Map<String, dynamic> json) {
//     return CustomerModel(
//       id: json['id'],
//       orderId: json['order_id'],
//       name: json['name'],
//       email: json['email'],
//       avatarUrl: json['avatar_url'],
//       ipAddress: json['ip_address'],
//       fullAddress: json['full_address'],
//       phoneNumber: json['phone_number'],
//       company: json['company'],
//       addressType: json['address_type'],
//       createdAt: json['created_at'],
//       updatedAt: json['updated_at'],
//     );
//   }
// }

// class ShippingAddressModel {
//   final int id;
//   final int orderId;
//   final String fullAddress;
//   final String phoneNumber;
//   final String createdAt;
//   final String updatedAt;

//   ShippingAddressModel({
//     required this.id,
//     required this.orderId,
//     required this.fullAddress,
//     required this.phoneNumber,
//     required this.createdAt,
//     required this.updatedAt,
//   });

//   factory ShippingAddressModel.fromJson(Map<String, dynamic> json) {
//     return ShippingAddressModel(
//       id: json['id'],
//       orderId: json['order_id'],
//       fullAddress: json['full_address'],
//       phoneNumber: json['phone_number'],
//       createdAt: json['created_at'],
//       updatedAt: json['updated_at'],
//     );
//   }
// }
class ChapaOrderResponse {
  final String status;
  final String message;
  final ChapaOrderData data;

  ChapaOrderResponse({
    required this.status,
    required this.message,
    required this.data,
  });

  factory ChapaOrderResponse.fromJson(Map<String, dynamic> json) =>
      ChapaOrderResponse(
        status: json['status'],
        message: json['message'],
        data: ChapaOrderData.fromJson(json['data']),
      );
}

class ChapaOrderData {
  final int orderId;
  final String orderNumber;
  final String invoiceNumber;
  final double total;
  final String status;
  final DateTime createdAt;

  ChapaOrderData({
    required this.orderId,
    required this.orderNumber,
    required this.invoiceNumber,
    required this.total,
    required this.status,
    required this.createdAt,
  });

  factory ChapaOrderData.fromJson(Map<String, dynamic> json) => ChapaOrderData(
        orderId: json['order_id'],
        orderNumber: json['order_number'],
        invoiceNumber: json['invoice_number'],
        total: json['total'],
        status: json['status'],
        createdAt: DateTime.parse(json['created_at']),
      );
}
