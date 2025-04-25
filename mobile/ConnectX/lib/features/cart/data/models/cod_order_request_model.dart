class CashOnDeliveryOrder {
  final List<CodItem> items;
  final CodBilling billing;
  final CodShipping shipping;
  final CodPayment payment;
  final String status;
  final double total;
  final double subtotal;
  final String notes;
  final String source;

  CashOnDeliveryOrder({
    required this.items,
    required this.billing,
    required this.shipping,
    required this.payment,
    required this.status,
    required this.total,
    required this.subtotal,
    required this.notes,
    required this.source,
  });

  factory CashOnDeliveryOrder.fromJson(Map<String, dynamic> json) =>
      CashOnDeliveryOrder(
        items:
            List<CodItem>.from(json['items'].map((x) => CodItem.fromJson(x))),
        billing: CodBilling.fromJson(json['billing']),
        shipping: CodShipping.fromJson(json['shipping']),
        payment: CodPayment.fromJson(json['payment']),
        status: json['status'],
        total: json['total'],
        subtotal: json['subtotal'],
        notes: json['notes'],
        source: json['source'],
      );

  Map<String, dynamic> toJson() => {
        'items': items.map((x) => x.toJson()).toList(),
        'billing': billing.toJson(),
        'shipping': shipping.toJson(),
        'payment': payment.toJson(),
        'status': status,
        'total': total,
        'subtotal': subtotal,
        'notes': notes,
        'source': source,
      };
}

class CodItem {
  final String id;
  final int quantity;
  final double price;
  final String name;
  final String sku;
  final String vendorId;
  final String coverUrl;

  CodItem({
    required this.id,
    required this.quantity,
    required this.price,
    required this.name,
    required this.sku,
    required this.vendorId,
    required this.coverUrl,
  });

  factory CodItem.fromJson(Map<String, dynamic> json) => CodItem(
        id: json['id'],
        quantity: json['quantity'],
        price: json['price'],
        name: json['name'],
        sku: json['sku'],
        vendorId: json['vendor_id'],
        coverUrl: json['coverUrl'],
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'quantity': quantity,
        'price': price,
        'name': name,
        'sku': sku,
        'vendor_id': vendorId,
        'coverUrl': coverUrl,
      };
}

class CodBilling {
  final String name;
  final String email;
  final String phoneNumber;
  final String fullAddress;

  CodBilling({
    required this.name,
    required this.email,
    required this.phoneNumber,
    required this.fullAddress,
  });

  factory CodBilling.fromJson(Map<String, dynamic> json) => CodBilling(
        name: json['name'],
        email: json['email'],
        phoneNumber: json['phoneNumber'],
        fullAddress: json['fullAddress'],
      );

  Map<String, dynamic> toJson() => {
        'name': name,
        'email': email,
        'phoneNumber': phoneNumber,
        'fullAddress': fullAddress,
      };
}

class CodShipping {
  final String address;
  final CodShippingMethod method;

  CodShipping({
    required this.address,
    required this.method,
  });

  factory CodShipping.fromJson(Map<String, dynamic> json) => CodShipping(
        address: json['address'],
        method: CodShippingMethod.fromJson(json['method']),
      );

  Map<String, dynamic> toJson() => {
        'address': address,
        'method': method.toJson(),
      };
}

class CodShippingMethod {
  final String id;
  final String label;
  final String description;
  final double value;

  CodShippingMethod({
    required this.id,
    required this.label,
    required this.description,
    required this.value,
  });

  factory CodShippingMethod.fromJson(Map<String, dynamic> json) =>
      CodShippingMethod(
        id: json['id'],
        label: json['label'],
        description: json['description'],
        value: json['value'],
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'label': label,
        'description': description,
        'value': value,
      };
}

class CodPayment {
  final String method;
  final String currency;
  final double amount;

  CodPayment({
    required this.method,
    required this.currency,
    required this.amount,
  });

  factory CodPayment.fromJson(Map<String, dynamic> json) => CodPayment(
        method: json['method'],
        currency: json['currency'],
        amount: json['amount'],
      );

  Map<String, dynamic> toJson() => {
        'method': method,
        'currency': currency,
        'amount': amount,
      };
}
