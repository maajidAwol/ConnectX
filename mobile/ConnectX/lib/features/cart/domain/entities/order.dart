import 'cart_item.dart';

class Order_Model {
  final String id;
  final String orderNumber;
  final double amount;
  final DateTime date;
  final String status;
  final List<CartItem> items;
  final String deliveryMethod;
  final String address;
  final String? invoiceNumber;
  final double? shippingFee;
  final double? tax;
  final double subtotal;
  final String paymentMethod;
  final String? txRef;

  Order_Model({
    required this.id,
    required this.orderNumber,
    required this.amount,
    required this.date,
    required this.status,
    required this.items,
    required this.deliveryMethod,
    required this.address,
    this.invoiceNumber,
    this.shippingFee,
    this.tax,
    required this.subtotal,
    required this.paymentMethod,
    this.txRef,
  });

  // Create from API response
  factory Order_Model.fromApiData({
    required String id,
    required String orderNumber,
    required double amount,
    required String status,
    required String createdAt,
    required String deliveryMethod,
    required String address,
    required List<CartItem> items,
    String? invoiceNumber,
    double? shippingFee,
    double? tax,
    required double subtotal,
    required String paymentMethod,
    String? txRef,
  }) {
    DateTime parsedDate;
    try {
      parsedDate = DateTime.parse(createdAt);
    } catch (e) {
      parsedDate = DateTime.now();
    }

    return Order_Model(
      id: id,
      orderNumber: orderNumber,
      amount: amount,
      date: parsedDate,
      status: status,
      items: items,
      deliveryMethod: deliveryMethod,
      address: address,
      invoiceNumber: invoiceNumber,
      shippingFee: shippingFee,
      tax: tax,
      subtotal: subtotal,
      paymentMethod: paymentMethod,
      txRef: txRef,
    );
  }

  // Parse JSON from API
  factory Order_Model.fromJson(Map<String, dynamic> json) {
    // Parse items list
    List<CartItem> orderItems = [];
    if (json['items'] != null) {
      orderItems = (json['items'] as List)
          .map((item) => CartItem.fromJson(item))
          .toList();
    }

    // Extract other fields with safe parsing
    return Order_Model(
      id: json['id']?.toString() ?? '',
      orderNumber: json['order_number']?.toString() ??
          json['orderNumber']?.toString() ??
          '',
      amount:
          (json['amount'] is num) ? (json['amount'] as num).toDouble() : 0.0,
      date: json['created_at'] != null || json['createdAt'] != null
          ? DateTime.parse(json['created_at'] ?? json['createdAt'])
          : DateTime.now(),
      status: json['status']?.toString() ?? 'pending',
      items: orderItems,
      deliveryMethod: json['delivery_method']?.toString() ??
          json['deliveryMethod']?.toString() ??
          'standard',
      address: json['address']?.toString() ??
          json['shipping_address']?.toString() ??
          '',
      invoiceNumber: json['invoice_number']?.toString(),
      shippingFee: (json['shipping_fee'] is num)
          ? (json['shipping_fee'] as num).toDouble()
          : null,
      tax: (json['tax'] is num) ? (json['tax'] as num).toDouble() : null,
      subtotal: (json['subtotal'] is num)
          ? (json['subtotal'] as num).toDouble()
          : 0.0,
      paymentMethod: json['payment_method']?.toString() ??
          json['paymentMethod']?.toString() ??
          'unknown',
      txRef: json['tx_ref']?.toString() ?? json['txRef']?.toString(),
    );
  }
}
