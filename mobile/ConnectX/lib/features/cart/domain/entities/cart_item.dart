class CartItem {
  final String id;
  final String productId;
  final String name;
  final double price;
  final String coverUrl;
  final int quantity;
  final String? size;
  final String? color;
  final String address;

  CartItem({
    required this.id,
    required this.productId,
    required this.name,
    required this.price,
    required this.coverUrl,
    required this.quantity,
    this.size,
    this.color,
    required this.address,
  });

  double get total => price * quantity;

  CartItem copyWith({
    String? id,
    String? productId,
    String? name,
    double? price,
    String? coverUrl,
    int? quantity,
    String? size,
    String? color,
    String? address,
  }) {
    return CartItem(
      id: id ?? this.id,
      productId: productId ?? this.productId,
      name: name ?? this.name,
      price: price ?? this.price,
      coverUrl: coverUrl ?? this.coverUrl,
      quantity: quantity ?? this.quantity,
      size: size ?? this.size,
      color: color ?? this.color,
      address: address ?? this.address,
    );
  }

  // Parse JSON from API
  factory CartItem.fromJson(Map<String, dynamic> json) {
    return CartItem(
      id: json['id']?.toString() ?? '',
      productId:
          json['product_id']?.toString() ?? json['productId']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      price: (json['price'] is num) ? (json['price'] as num).toDouble() : 0.0,
      coverUrl:
          json['cover_url']?.toString() ?? json['coverUrl']?.toString() ?? '',
      quantity:
          (json['quantity'] is num) ? (json['quantity'] as num).toInt() : 1,
      size: json['size']?.toString(),
      color: json['color']?.toString(),
      address: json['address']?.toString() ?? '',
    );
  }
}
