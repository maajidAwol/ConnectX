
class MyOrdersModel {
  final String status;
  final List<OrderItemModel> orders;
  final PaginationModel pagination;

  MyOrdersModel({
    required this.status,
    required this.orders,
    required this.pagination,
  });

  factory MyOrdersModel.fromJson(Map<String, dynamic> json) {
    return MyOrdersModel(
      status: json['status'],
      orders: (json['orders'] as List)
          .map((order) => OrderItemModel.fromJson(order))
          .toList(),
      pagination: PaginationModel.fromJson(json['pagination']),
    );
  }
}

class OrderItemModel {
  final int id;
  final double taxes;
  final String status;
  final double shipping;
  final double discount;
  final double subtotal;
  final String orderNumber;
  final double totalAmount;
  final int totalQuantity;
  final String createdAt;
  final CustomerModel customer;
  final List<OrderProductModel> items;
  final ShippingAddressModel shippingAddress;
  final PaymentModel? payment;
  final DeliveryModel delivery;
  final OrderHistoryModel history;

  OrderItemModel({
    required this.id,
    required this.taxes,
    required this.status,
    required this.shipping,
    required this.discount,
    required this.subtotal,
    required this.orderNumber,
    required this.totalAmount,
    required this.totalQuantity,
    required this.createdAt,
    required this.customer,
    required this.items,
    required this.shippingAddress,
    this.payment,
    required this.delivery,
    required this.history,
  });

  factory OrderItemModel.fromJson(Map<String, dynamic> json) {
    return OrderItemModel(
      id: json['id'],
      taxes: json['taxes']?.toDouble() ?? 0.0,
      status: json['status'],
      shipping: json['shipping']?.toDouble() ?? 0.0,
      discount: json['discount']?.toDouble() ?? 0.0,
      subtotal: json['subtotal']?.toDouble() ?? 0.0,
      orderNumber: json['orderNumber'],
      totalAmount: json['totalAmount']?.toDouble() ?? 0.0,
      totalQuantity: json['totalQuantity'],
      createdAt: json['createdAt'],
      customer: CustomerModel.fromJson(json['customer']),
      items: (json['items'] as List)
          .map((item) => OrderProductModel.fromJson(item))
          .toList(),
      shippingAddress: ShippingAddressModel.fromJson(json['shippingAddress']),
      payment: json['payment'] != null
          ? PaymentModel.fromJson(json['payment'])
          : null,
      delivery: DeliveryModel.fromJson(json['delivery']),
      history: OrderHistoryModel.fromJson(json['history']),
    );
  }
}

class CustomerModel {
  final int id;
  final String name;
  final String email;
  final String? avatarUrl;
  final String ipAddress;

  CustomerModel({
    required this.id,
    required this.name,
    required this.email,
    this.avatarUrl,
    required this.ipAddress,
  });

  factory CustomerModel.fromJson(Map<String, dynamic> json) {
    return CustomerModel(
      id: json['id'],
      name: json['name'],
      email: json['email'],
      avatarUrl: json['avatarUrl'],
      ipAddress: json['ipAddress'],
    );
  }
}

class OrderProductModel {
  final int id;
  final String sku;
  final String name;
  final double price;
  final String coverUrl;
  final int quantity;

  OrderProductModel({
    required this.id,
    required this.sku,
    required this.name,
    required this.price,
    required this.coverUrl,
    required this.quantity,
  });

  factory OrderProductModel.fromJson(Map<String, dynamic> json) {
    return OrderProductModel(
      id: json['id'],
      sku: json['sku'],
      name: json['name'],
      price: json['price']?.toDouble() ?? 0.0,
      coverUrl: json['coverUrl'],
      quantity: json['quantity'],
    );
  }
}

class ShippingAddressModel {
  final int id;
  final String fullAddress;
  final String phoneNumber;

  ShippingAddressModel({
    required this.id,
    required this.fullAddress,
    required this.phoneNumber,
  });

  factory ShippingAddressModel.fromJson(Map<String, dynamic> json) {
    return ShippingAddressModel(
      id: json['id'],
      fullAddress: json['fullAddress'],
      phoneNumber: json['phoneNumber'],
    );
  }
}

class PaymentModel {
  // Add payment-related fields when available
  PaymentModel();

  factory PaymentModel.fromJson(Map<String, dynamic> json) {
    return PaymentModel();
  }
}

class DeliveryModel {
  final String shipBy;
  final String speedy;
  final String trackingNumber;

  DeliveryModel({
    required this.shipBy,
    required this.speedy,
    required this.trackingNumber,
  });

  factory DeliveryModel.fromJson(Map<String, dynamic> json) {
    return DeliveryModel(
      shipBy: json['shipBy'],
      speedy: json['speedy'],
      trackingNumber: json['trackingNumber'],
    );
  }
}

class OrderHistoryModel {
  final int id;
  final String? paymentTime;
  final String? deliveryTime;
  final String? completionTime;
  final List<TimelineModel> timeline;

  OrderHistoryModel({
    required this.id,
    this.paymentTime,
    this.deliveryTime,
    this.completionTime,
    required this.timeline,
  });

  factory OrderHistoryModel.fromJson(Map<String, dynamic> json) {
    return OrderHistoryModel(
      id: json['id'],
      paymentTime: json['paymentTime'],
      deliveryTime: json['deliveryTime'],
      completionTime: json['completionTime'],
      timeline: (json['timeline'] as List)
          .map((item) => TimelineModel.fromJson(item))
          .toList(),
    );
  }
}

class TimelineModel {
  final String time;
  final String title;
  final String? endTime;

  TimelineModel({
    required this.time,
    required this.title,
    this.endTime,
  });

  factory TimelineModel.fromJson(Map<String, dynamic> json) {
    return TimelineModel(
      time: json['time'],
      title: json['title'],
      endTime: json['end_time'],
    );
  }
}

class PaginationModel {
  final int total;
  final int perPage;
  final int currentPage;
  final int lastPage;

  PaginationModel({
    required this.total,
    required this.perPage,
    required this.currentPage,
    required this.lastPage,
  });

  factory PaginationModel.fromJson(Map<String, dynamic> json) {
    return PaginationModel(
      total: json['total'],
      perPage: json['per_page'],
      currentPage: json['current_page'],
      lastPage: json['last_page'],
    );
  }
}
