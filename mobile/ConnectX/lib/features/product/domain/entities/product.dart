import 'product_entities.dart';

class Product {
  final String id;
  final String name;
  final String? sku;
  final String? code;
  final String description;
  final String subDescription;
  final String publish;
  final double price;
  final double? priceSale;
  final double taxes;
  final String coverUrl;
  final List<String> tags;
  final List<String> sizes;
  final List<String> colors;
  final List<String> gender;
  final String inventoryType;
  final int quantity;
  final int available;
  final int totalSold;
  final double totalRatings;
  final int totalReviews;
  final List<ProductImage> images;
  final Vendor vendor;
  final String category;
  final List<Review> reviews;
  final List<Rating> ratings;
  final Label newLabel;
  final SaleLabel saleLabel;
  final DateTime createdAt;
  final Brand brand;

  Product({
    required this.id,
    required this.name,
    this.sku,
    this.code,
    required this.description,
    required this.subDescription,
    required this.publish,
    required this.price,
    this.priceSale,
    required this.taxes,
    required this.coverUrl,
    required this.tags,
    required this.sizes,
    required this.colors,
    required this.gender,
    required this.inventoryType,
    required this.quantity,
    required this.available,
    required this.totalSold,
    required this.totalRatings,
    required this.totalReviews,
    required this.images,
    required this.vendor,
    required this.category,
    required this.reviews,
    required this.ratings,
    required this.newLabel,
    required this.saleLabel,
    required this.createdAt,
    required this.brand,
  });

  bool get isFeatured => true;
  bool get isTopRated => totalRatings >= 4.5;
  bool get isOnSale => priceSale != null && priceSale! > 0 && saleLabel.enabled;
}
