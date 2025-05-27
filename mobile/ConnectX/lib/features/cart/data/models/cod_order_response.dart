class CashOnDeliveryResponse {
  final String status;
  final Order order;
  final String? checkoutUrl;

  CashOnDeliveryResponse({
    required this.status,
    required this.order,
    this.checkoutUrl,
  });

  factory CashOnDeliveryResponse.fromJson(Map<String, dynamic> json) {
    return CashOnDeliveryResponse(
      status: json['status'],
      order: Order.fromJson(json['order']),
      checkoutUrl: json['checkout_url'],
    );
  }
}

class Order {
  final int userId;
  final double taxes;
  final String status;
  final double shipping;
  final double discount;
  final double subtotal;
  final String orderNumber;
  final double totalAmount;
  final int totalQuantity;
  final String updatedAt;
  final String createdAt;
  final int id;

  Order({
    required this.userId,
    required this.taxes,
    required this.status,
    required this.shipping,
    required this.discount,
    required this.subtotal,
    required this.orderNumber,
    required this.totalAmount,
    required this.totalQuantity,
    required this.updatedAt,
    required this.createdAt,
    required this.id,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      userId: json['user_id'],
      taxes: (json['taxes'] as num).toDouble(),
      status: json['status'],
      shipping: (json['shipping'] as num).toDouble(),
      discount: (json['discount'] as num).toDouble(),
      subtotal: (json['subtotal'] as num).toDouble(),
      orderNumber: json['order_number'],
      totalAmount: (json['total_amount'] as num).toDouble(),
      totalQuantity: json['total_quantity'],
      updatedAt: json['updated_at'],
      createdAt: json['created_at'],
      id: json['id'],
    );
  }
}
