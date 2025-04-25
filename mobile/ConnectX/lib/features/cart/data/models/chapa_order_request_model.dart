// import '../../domain/entities/cart_item.dart';
// import 'package:shop/features/authentication/domain/entities/address.dart';
// import '../../domain/entities/delivery_method.dart';
// import '../../domain/entities/payment_method.dart';

// class OrderRequestModel {
//   final List<OrderItemModel> items;
//   final BillingModel billing;
//   final ShippingModel shipping;
//   final PaymentInfoModel payment;
//   final String status;
//   final double total;
//   final double subtotal;
//   final double discount;
//   final String? notes;
//   final String source;

//   OrderRequestModel({
//     required this.items,
//     required this.billing,
//     required this.shipping,
//     required this.payment,
//     required this.status,
//     required this.total,
//     required this.subtotal,
//     this.discount = 0,
//     this.notes,
//     this.source = 'mobile',
//   });

//   Map<String, dynamic> toJson() {
//     return {
//       'items': items.map((item) => item.toJson()).toList(),
//       'billing': billing.toJson(),
//       'shipping': shipping.toJson(),
//       'payment': payment.toJson(),
//       'status': status,
//       'total': total,
//       'subtotal': subtotal,
//       'discount': discount,
//       if (notes != null) 'notes': notes,
//       'source': source,
//     };
//   }

//   factory OrderRequestModel.fromCartItems({
//     required List<CartItem> items,
//     required String address,
//     required String deliveryMethod,
//     required String paymentMethod,
//     required double subtotal,
//     required double total,
//     required String? userEmail,
//     required String? userName,
//   }) {
//     final isCashOnDelivery = paymentMethod == 'PaymentMethod.cashOnDelivery';

//     return OrderRequestModel(
//       items: items.map((item) => OrderItemModel.fromCartItem(item)).toList(),
//       billing: BillingModel(
//         name: userName ?? 'Customer',
//         email: userEmail ?? 'customer@example.com',
//         phoneNumber: 'phoneNumber',
//         fullAddress: 'fullAddress',
//         addressType: 'addressType',
//       ),
//       shipping: ShippingModel(
//         address: 'address',
//         phoneNumber: 'phoneNumber',
//         method: ShippingMethodModel(
//           id: 'deliveryMethod',
//           label: 'deliveryMethod',
//           description: 'deliveryMethod',
//           value: 0,
//         ),
//       ),
//       payment: PaymentInfoModel(
//         method: isCashOnDelivery ? 'cash' : 'chapa',
//         currency: 'ETB',
//         amount: total,
//       ),
//       status: isCashOnDelivery ? 'pending' : 'success',
//       total: total,
//       subtotal: subtotal,
//     );
//   }
// }

// class OrderItemModel {
//   final String id;
//   final int quantity;
//   final double price;
//   final String name;
//   final String? sku;
//   final String? vendorId;
//   final String? coverUrl;

//   OrderItemModel({
//     required this.id,
//     required this.quantity,
//     required this.price,
//     required this.name,
//     this.sku,
//     this.vendorId,
//     this.coverUrl,
//   });

//   Map<String, dynamic> toJson() {
//     return {
//       'id': id,
//       'quantity': quantity,
//       'price': price,
//       'name': name,
//       if (sku != null) 'sku': sku,
//       if (vendorId != null) 'vendor_id': vendorId,
//       if (coverUrl != null) 'coverUrl': coverUrl,
//     };
//   }

//   factory OrderItemModel.fromCartItem(CartItem item) {
//     return OrderItemModel(
//       id: item.id,
//       quantity: item.quantity,
//       price: item.price,
//       name: item.name,
//       coverUrl: item.coverUrl,
//     );
//   }
// }

// class BillingModel {
//   final String name;
//   final String email;
//   final String phoneNumber;
//   final String fullAddress;
//   final String? company;
//   final String? addressType;

//   BillingModel({
//     required this.name,
//     required this.email,
//     required this.phoneNumber,
//     required this.fullAddress,
//     this.company,
//     this.addressType,
//   });

//   Map<String, dynamic> toJson() {
//     return {
//       'name': name,
//       'email': email,
//       'phoneNumber': phoneNumber,
//       'fullAddress': fullAddress,
//       if (company != null) 'company': company,
//       if (addressType != null) 'addressType': addressType,
//     };
//   }
// }

// class ShippingModel {
//   final String address;
//   final String phoneNumber;
//   final ShippingMethodModel method;

//   ShippingModel({
//     required this.address,
//     required this.phoneNumber,
//     required this.method,
//   });

//   Map<String, dynamic> toJson() {
//     return {
//       'address': address,
//       'phoneNumber': phoneNumber,
//       'method': method.toJson(),
//     };
//   }
// }

// class ShippingMethodModel {
//   final String id;
//   final String label;
//   final String description;
//   final double value;

//   ShippingMethodModel({
//     required this.id,
//     required this.label,
//     required this.description,
//     required this.value,
//   });

//   Map<String, dynamic> toJson() {
//     return {
//       'id': id,
//       'label': label,
//       'description': description,
//       'value': value,
//     };
//   }
// }

// class PaymentInfoModel {
//   final String method;
//   final String currency;
//   final double amount;
//   final String? txRef;
//   final String? transactionId;

//   PaymentInfoModel({
//     required this.method,
//     required this.currency,
//     required this.amount,
//     this.txRef,
//     this.transactionId,
//   });

//   Map<String, dynamic> toJson() {
//     return {
//       'method': method,
//       'currency': currency,
//       'amount': amount,
//       if (txRef != null) 'tx_ref': txRef,
//       if (transactionId != null) 'transaction_id': transactionId,
//     };
//   }
// }

// class ChapaVerifyRequestModel {
//   final PaymentInfoModel payment;
//   final String status;
//   final double amount;
//   final String currency;
//   final List<OrderItemModel> items;
//   final BillingModel billing;
//   final ShippingModel shipping;
//   final DeliveryInfoModel delivery;
//   final double discount;
//   final double total;
//   final double subtotal;

//   ChapaVerifyRequestModel({
//     required this.payment,
//     required this.status,
//     required this.amount,
//     required this.currency,
//     required this.items,
//     required this.billing,
//     required this.shipping,
//     required this.delivery,
//     this.discount = 0,
//     required this.total,
//     required this.subtotal,
//   });

//   Map<String, dynamic> toJson() {
//     return {
//       'payment': payment.toJson(),
//       'status': status,
//       'amount': amount,
//       'currency': currency,
//       'items': items.map((item) => item.toJson()).toList(),
//       'billing': billing.toJson(),
//       'shipping': shipping.toJson(),
//       'delivery': delivery.toJson(),
//       'discount': discount,
//       'total': total,
//       'subtotal': subtotal,
//     };
//   }

//   factory ChapaVerifyRequestModel.fromCartOrder({
//     required List<CartItem> items,
//     required String address,
//     required String deliveryMethod,
//     required String txRef,
//     required double total,
//     required double subtotal,
//     required String? userEmail,
//     required String? userName,
//   }) {
//     return ChapaVerifyRequestModel(
//       payment: PaymentInfoModel(
//         method: 'chapa',
//         currency: 'ETB',
//         amount: total,
//         txRef: txRef,
//       ),
//       status: 'success',
//       amount: total,
//       currency: 'ETB',
//       items: items.map((item) => OrderItemModel.fromCartItem(item)).toList(),
//       billing: BillingModel(
//         name: userName ?? 'Customer',
//         email: userEmail ?? 'customer@example.com',
//         phoneNumber: 'phoneNumber',
//         fullAddress: 'fullAddress',
//         addressType: 'addressType',
//       ),
//       shipping: ShippingModel(
//         address: 'address',
//         phoneNumber: 'phoneNumber',
//         method: ShippingMethodModel(
//           id: 'deliveryMethod',
//           label: 'deliveryMethod',
//           description: 'deliveryMethod',
//           value: 0,
//         ),
//       ),
//       delivery: DeliveryInfoModel(
//         method: 'deliveryMethod',
//         fee: 0,
//       ),
//       total: total,
//       subtotal: subtotal,
//     );
//   }
// }

// class DeliveryInfoModel {
//   final String method;
//   final double fee;

//   DeliveryInfoModel({
//     required this.method,
//     required this.fee,
//   });

//   Map<String, dynamic> toJson() {
//     return {
//       'method': method,
//       'fee': fee,
//     };
//   }
// }
class Payment {
  final double amount;
  final String txRef;
  final String transactionId;

  Payment({
    required this.amount,
    required this.txRef,
    required this.transactionId,
  });

  factory Payment.fromJson(Map<String, dynamic> json) => Payment(
        amount: json['amount'],
        txRef: json['tx_ref'],
        transactionId: json['transaction_id'],
      );
}

class Item {
  final String id;
  final int quantity;
  final double price;
  final String name;
  final String coverUrl;

  Item({
    required this.id,
    required this.quantity,
    required this.price,
    required this.name,
    required this.coverUrl,
  });

  factory Item.fromJson(Map<String, dynamic> json) => Item(
        id: json['id'],
        quantity: json['quantity'],
        price: json['price'],
        name: json['name'],
        coverUrl: json['coverUrl'],
      );
}

class Billing {
  final String name;
  final String email;
  final String phoneNumber;
  final String fullAddress;
  final String company;
  final String addressType;

  Billing({
    required this.name,
    required this.email,
    required this.phoneNumber,
    required this.fullAddress,
    required this.company,
    required this.addressType,
  });

  factory Billing.fromJson(Map<String, dynamic> json) => Billing(
        name: json['name'],
        email: json['email'],
        phoneNumber: json['phoneNumber'],
        fullAddress: json['fullAddress'],
        company: json['company'],
        addressType: json['addressType'],
      );
}

class ShippingMethod {
  final String label;
  final String description;
  final double value;

  ShippingMethod({
    required this.label,
    required this.description,
    required this.value,
  });

  factory ShippingMethod.fromJson(Map<String, dynamic> json) => ShippingMethod(
        label: json['label'],
        description: json['description'],
        value: json['value'],
      );
}

class Shipping {
  final String address;
  final String phoneNumber;
  final ShippingMethod method;

  Shipping({
    required this.address,
    required this.phoneNumber,
    required this.method,
  });

  factory Shipping.fromJson(Map<String, dynamic> json) => Shipping(
        address: json['address'],
        phoneNumber: json['phoneNumber'],
        method: ShippingMethod.fromJson(json['method']),
      );
}

class Delivery {
  final String method;
  final double fee;

  Delivery({
    required this.method,
    required this.fee,
  });

  factory Delivery.fromJson(Map<String, dynamic> json) => Delivery(
        method: json['method'],
        fee: json['fee'],
      );
}

class ChapaOrderModel {
  final Payment payment;
  final String status;
  final double amount;
  final String currency;
  final List<Item> items;
  final Billing billing;
  final Shipping shipping;
  final Delivery delivery;
  final double discount;
  final double total;
  final double subtotal;

  ChapaOrderModel({
    required this.payment,
    required this.status,
    required this.amount,
    required this.currency,
    required this.items,
    required this.billing,
    required this.shipping,
    required this.delivery,
    required this.discount,
    required this.total,
    required this.subtotal,
  });

  factory ChapaOrderModel.fromJson(Map<String, dynamic> json) => ChapaOrderModel(
        payment: Payment.fromJson(json['payment']),
        status: json['status'],
        amount: json['amount'],
        currency: json['currency'],
        items: (json['items'] as List).map((item) => Item.fromJson(item)).toList(),
        billing: Billing.fromJson(json['billing']),
        shipping: Shipping.fromJson(json['shipping']),
        delivery: Delivery.fromJson(json['delivery']),
        discount: json['discount'],
        total: json['total'],
        subtotal: json['subtotal'],
      );
}
