class OrderDetailsModel {
  final String id;
  final String orderNumber;
  final String sellerTenantId;
  final String sellerTenantName;
  final String userName;
  final String status;
  final double subtotal;
  final double taxes;
  final double shipping;
  final double discount;
  final double totalAmount;
  final String? notes;
  final String email;
  final String phone;
  final String createdAt;
  final String updatedAt;
  final ShippingAddressDetails shippingAddressDetails;
  final List<OrderItemDetails> items;
  final List<OrderHistory> history;

  OrderDetailsModel({
    required this.id,
    required this.orderNumber,
    required this.sellerTenantId,
    required this.sellerTenantName,
    required this.userName,
    required this.status,
    required this.subtotal,
    required this.taxes,
    required this.shipping,
    required this.discount,
    required this.totalAmount,
    this.notes,
    required this.email,
    required this.phone,
    required this.createdAt,
    required this.updatedAt,
    required this.shippingAddressDetails,
    required this.items,
    required this.history,
  });

  factory OrderDetailsModel.fromJson(Map<String, dynamic> json) {
    return OrderDetailsModel(
      id: json['id'] ?? '',
      orderNumber: json['order_number'] ?? '',
      sellerTenantId: json['seller_tenant_id'] ?? '',
      sellerTenantName: json['seller_tenant_name'] ?? '',
      userName: json['user_name'] ?? '',
      status: json['status'] ?? '',
      subtotal: double.tryParse(json['subtotal']?.toString() ?? '0.0') ?? 0.0,
      taxes: double.tryParse(json['taxes']?.toString() ?? '0.0') ?? 0.0,
      shipping: double.tryParse(json['shipping']?.toString() ?? '0.0') ?? 0.0,
      discount: double.tryParse(json['discount']?.toString() ?? '0.0') ?? 0.0,
      totalAmount:
          double.tryParse(json['total_amount']?.toString() ?? '0.0') ?? 0.0,
      notes: json['notes'],
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
      shippingAddressDetails: ShippingAddressDetails.fromJson(
        json['shipping_address_details'] ?? {},
      ),
      items:
          (json['items'] as List? ?? [])
              .map((item) => OrderItemDetails.fromJson(item))
              .toList(),
      history:
          (json['history'] as List? ?? [])
              .map((history) => OrderHistory.fromJson(history))
              .toList(),
    );
  }
}

class ShippingAddressDetails {
  final String id;
  final String fullAddress;
  final String phoneNumber;

  ShippingAddressDetails({
    required this.id,
    required this.fullAddress,
    required this.phoneNumber,
  });

  factory ShippingAddressDetails.fromJson(Map<String, dynamic> json) {
    return ShippingAddressDetails(
      id: json['id'] ?? '',
      fullAddress: json['full_address'] ?? '',
      phoneNumber: json['phone_number'] ?? '',
    );
  }
}

class OrderItemDetails {
  final String id;
  final String product;
  final ProductDetails productDetails;
  final String productOwnerTenantId;
  final String productOwnerTenantName;
  final int quantity;
  final double price;
  final String? customProfitPercentage;
  final double customSellingPrice;

  OrderItemDetails({
    required this.id,
    required this.product,
    required this.productDetails,
    required this.productOwnerTenantId,
    required this.productOwnerTenantName,
    required this.quantity,
    required this.price,
    this.customProfitPercentage,
    required this.customSellingPrice,
  });

  factory OrderItemDetails.fromJson(Map<String, dynamic> json) {
    return OrderItemDetails(
      id: json['id'] ?? '',
      product: json['product'] ?? '',
      productDetails: ProductDetails.fromJson(json['product_details'] ?? {}),
      productOwnerTenantId: json['product_owner_tenant_id'] ?? '',
      productOwnerTenantName: json['product_owner_tenant_name'] ?? '',
      quantity: json['quantity'] ?? 0,
      price: double.tryParse(json['price']?.toString() ?? '0.0') ?? 0.0,
      customProfitPercentage: json['custom_profit_percentage']?.toString(),
      customSellingPrice:
          double.tryParse(json['custom_selling_price']?.toString() ?? '0.0') ??
          0.0,
    );
  }
}

class ProductDetails {
  final String id;
  final String name;
  final String sku;
  final String coverUrl;

  ProductDetails({
    required this.id,
    required this.name,
    required this.sku,
    required this.coverUrl,
  });

  factory ProductDetails.fromJson(Map<String, dynamic> json) {
    return ProductDetails(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      sku: json['sku'] ?? '',
      coverUrl: json['cover_url'] ?? '',
    );
  }
}

class OrderHistory {
  final String status;
  final String description;
  final String createdByName;
  final String createdAt;

  OrderHistory({
    required this.status,
    required this.description,
    required this.createdByName,
    required this.createdAt,
  });

  factory OrderHistory.fromJson(Map<String, dynamic> json) {
    return OrderHistory(
      status: json['status'] ?? '',
      description: json['description'] ?? '',
      createdByName: json['created_by_name'] ?? '',
      createdAt: json['created_at'] ?? '',
    );
  }
}
