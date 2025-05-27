class MyOrdersModel {
  final int count;
  final String? next;
  final String? previous;
  final List<OrderItemModel> orders;

  MyOrdersModel({
    required this.count,
    this.next,
    this.previous,
    required this.orders,
  });

  factory MyOrdersModel.fromJson(Map<String, dynamic> json) {
    return MyOrdersModel(
      count: json['count'] ?? 0,
      next: json['next'],
      previous: json['previous'],
      orders:
          (json['results'] as List? ?? [])
              .map((order) => OrderItemModel.fromJson(order))
              .toList(),
    );
  }
}

class OrderItemModel {
  final String id;
  final String orderNumber;
  final String sellerTenantId;
  final String sellerTenantName;
  final String status;
  final double totalAmount;
  final String createdAt;
  final int itemsCount;
  final int totalQuantity;
  final FirstItemModel firstItem;
  final PaymentStatusModel paymentStatus;

  // We'll keep these for backward compatibility, but they might be populated with dummy data
  final double taxes;
  final double shipping;
  final double discount;
  final double subtotal;
  final CustomerModel customer;
  final List<OrderProductModel> items;
  final ShippingAddressModel shippingAddress;
  final DeliveryModel delivery;
  final OrderHistoryModel history;

  OrderItemModel({
    required this.id,
    required this.orderNumber,
    required this.sellerTenantId,
    required this.sellerTenantName,
    required this.status,
    required this.totalAmount,
    required this.createdAt,
    required this.itemsCount,
    required this.totalQuantity,
    required this.firstItem,
    required this.paymentStatus,
    // Backward compatibility fields
    this.taxes = 0.0,
    this.shipping = 0.0,
    this.discount = 0.0,
    this.subtotal = 0.0,
    required this.customer,
    required this.items,
    required this.shippingAddress,
    required this.delivery,
    required this.history,
  });

  factory OrderItemModel.fromJson(Map<String, dynamic> json) {
    // Create simple mock data for backward compatibility
    final mockCustomer = CustomerModel(
      id: 1,
      name: "Customer",
      email: json['email'] ?? 'customer@example.com',
      ipAddress: '',
    );

    final mockShippingAddress = ShippingAddressModel(
      id: 1,
      fullAddress: "Shipping Address",
      phoneNumber: "",
    );

    final mockDelivery = DeliveryModel(
      shipBy: "",
      speedy: "",
      trackingNumber: "",
    );

    final mockHistory = OrderHistoryModel(
      id: 1,
      timeline: [
        TimelineModel(
          time: json['created_at'] ?? DateTime.now().toString(),
          title: "Order Placed",
        ),
      ],
    );

    // Mock items from the first item
    final firstItemData = json['first_item'] ?? {};
    final mockItems = [
      OrderProductModel(
        id: 1,
        sku: "",
        name: firstItemData['product_name'] ?? "Product",
        price: 0.0,
        coverUrl: firstItemData['cover_url'] ?? "",
        quantity: json['total_quantity'] ?? 1,
      ),
    ];

    return OrderItemModel(
      id: json['id'] ?? '',
      orderNumber: json['order_number'] ?? '',
      sellerTenantId: json['seller_tenant_id'] ?? '',
      sellerTenantName: json['seller_tenant_name'] ?? '',
      status: json['status'] ?? '',
      totalAmount:
          double.tryParse(json['total_amount']?.toString() ?? '0.0') ?? 0.0,
      createdAt: json['created_at'] ?? '',
      itemsCount: json['items_count'] ?? 0,
      totalQuantity: json['total_quantity'] ?? 0,
      firstItem: FirstItemModel.fromJson(json['first_item'] ?? {}),
      paymentStatus: PaymentStatusModel.fromJson(json['payment_status'] ?? {}),
      // Backward compatibility fields
      customer: mockCustomer,
      items: mockItems,
      shippingAddress: mockShippingAddress,
      delivery: mockDelivery,
      history: mockHistory,
    );
  }
}

class FirstItemModel {
  final String productName;
  final String productId;
  final String coverUrl;

  FirstItemModel({
    required this.productName,
    required this.productId,
    required this.coverUrl,
  });

  factory FirstItemModel.fromJson(Map<String, dynamic> json) {
    return FirstItemModel(
      productName: json['product_name'] ?? '',
      productId: json['product_id'] ?? '',
      coverUrl: json['cover_url'] ?? '',
    );
  }
}

class PaymentStatusModel {
  final String displayStatus;
  final String? method;

  PaymentStatusModel({required this.displayStatus, this.method});

  factory PaymentStatusModel.fromJson(Map<String, dynamic> json) {
    return PaymentStatusModel(
      displayStatus: json['display_status'] ?? 'Unknown',
      method: json['method'],
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
      timeline:
          ((json['timeline'] as List?) ?? [])
              .map((item) => TimelineModel.fromJson(item))
              .toList(),
    );
  }
}

class TimelineModel {
  final String time;
  final String title;
  final String? endTime;

  TimelineModel({required this.time, required this.title, this.endTime});

  factory TimelineModel.fromJson(Map<String, dynamic> json) {
    return TimelineModel(
      time: json['time'],
      title: json['title'],
      endTime: json['end_time'],
    );
  }
}
