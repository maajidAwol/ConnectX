import '../../domain/entities/product.dart';
import '../../domain/entities/product_entities.dart';
import 'dart:ui';

class ProductModel extends Product {
  ProductModel({
    required super.id,
    required super.name,
    super.sku,
    super.code,
    required super.description,
    required super.subDescription,
    required super.publish,
    required super.price,
    super.priceSale,
    required super.taxes,
    required super.coverUrl,
    required super.tags,
    required super.sizes,
    required super.colors,
    required super.gender,
    required super.inventoryType,
    required super.quantity,
    required super.available,
    required super.totalSold,
    required super.totalRatings,
    required super.totalReviews,
    required super.images,
    required super.vendor,
    required super.category,
    required super.reviews,
    required super.ratings,
    required super.newLabel,
    required super.saleLabel,
    required super.createdAt,
    required super.brand,
    super.additionalInfo,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    try {
      return ProductModel(
        id: json['id'] as String? ?? '',
        name: json['name'] as String? ?? '',
        sku: json['sku'] as String?,
        code: json['code'] as String?,
        description: json['description'] as String? ?? '',
        subDescription: json['subDescription'] as String? ?? '',
        publish: json['publish'] as String? ?? 'draft',
        price: (json['price'] as num?)?.toDouble() ?? 0.0,
        priceSale: (json['priceSale'] as num?)?.toDouble(),
        taxes: (json['taxes'] as num?)?.toDouble() ?? 0.0,
        coverUrl: json['coverUrl'] as String? ?? '',
        tags:
            (json['tags'] as List<dynamic>?)
                ?.map((e) => e.toString())
                .toList() ??
            [],
        sizes:
            (json['sizes'] as List<dynamic>?)
                ?.map((e) => e.toString())
                .toList() ??
            [],
        colors:
            (json['colors'] as List<dynamic>?)
                ?.map((e) => e.toString())
                .toList() ??
            [],
        gender:
            (json['gender'] as List<dynamic>?)
                ?.map((e) => e.toString())
                .toList() ??
            [],
        inventoryType: json['inventoryType'] as String? ?? 'in_stock',
        quantity: (json['quantity'] as num?)?.toInt() ?? 0,
        available: (json['available'] as num?)?.toInt() ?? 0,
        totalSold: (json['totalSold'] as num?)?.toInt() ?? 0,
        totalRatings: (json['totalRatings'] as num?)?.toDouble() ?? 0.0,
        totalReviews: (json['totalReviews'] as num?)?.toInt() ?? 0,
        images: _parseImages(json['images']),
        vendor: _parseVendor(json['vendor']),
        category: json['category'] as String? ?? 'uncategorized',
        reviews: _parseReviews(json['reviews']),
        ratings: _parseRatings(json['ratings']),
        newLabel: _parseLabel(json['newLabel']),
        saleLabel: _parseSaleLabel(json['saleLabel']),
        createdAt:
            json['createdAt'] != null
                ? DateTime.parse(json['createdAt'].toString())
                : DateTime.now(),
        brand: _parseBrand(json['brand']),
        additionalInfo: json['additional_info'],
      );
    } catch (e) {
      print('Error parsing ProductModel: $e');
      print('JSON data: $json');
      rethrow;
    }
  }

  static List<ProductImage> _parseImages(dynamic images) {
    if (images is List) {
      return images.map((image) {
        if (image is String) {
          return ProductImage(url: image);
        } else if (image is Map<String, dynamic>) {
          return ProductImage(url: image['url'] as String? ?? '');
        }
        return ProductImage(url: '');
      }).toList();
    }
    return [];
  }

  static Vendor _parseVendor(dynamic json) {
    if (json is Map<String, dynamic>) {
      return Vendor(
        name: json['name'] as String? ?? '',
        logo: json['logo'] as String?,
      );
    }
    return Vendor.empty();
  }

  static Brand _parseBrand(dynamic json) {
    if (json is Map<String, dynamic>) {
      return Brand(
        name: json['name'] as String? ?? '',
        logo: json['logo'] as String?,
      );
    }
    return Brand.empty();
  }

  static List<Review> _parseReviews(dynamic reviews) {
    if (reviews is List) {
      return reviews.map((review) {
        if (review is Map<String, dynamic>) {
          return Review(
            id: review['id'] as String? ?? '',
            content: review['comment'] as String? ?? '',
          );
        }
        return Review(id: '', content: '');
      }).toList();
    }
    return [];
  }

  static List<Rating> _parseRatings(dynamic ratings) {
    if (ratings is List) {
      return ratings.map((rating) {
        if (rating is Map<String, dynamic>) {
          return Rating(
            value: (rating['starCount'] as num?)?.toDouble() ?? 0.0,
          );
        }
        return Rating(value: 0.0);
      }).toList();
    }
    return [];
  }

  static Label _parseLabel(dynamic json) {
    if (json is Map<String, dynamic>) {
      return Label(
        enabled: json['enabled'] as bool? ?? false,
        text: json['content'] as String?,
      );
    }
    return Label.empty();
  }

  static SaleLabel _parseSaleLabel(dynamic json) {
    if (json is Map<String, dynamic>) {
      return SaleLabel(
        enabled: json['enabled'] as bool? ?? false,
        text: json['content'] as String?,
      );
    }
    return SaleLabel.empty();
  }

  // Convert color string to Color object
  static Color parseColor(String colorStr) {
    if (colorStr.startsWith('#')) {
      try {
        return Color(
          int.parse(colorStr.substring(1, 7), radix: 16) + 0xFF000000,
        );
      } catch (e) {
        return Color(0xFF2196F3); // Default to blue if invalid hex
      }
    } else {
      // Handle named colors
      switch (colorStr.toLowerCase()) {
        case 'red':
          return Color(0xFFF44336);
        case 'green':
          return Color(0xFF4CAF50);
        case 'blue':
          return Color(0xFF2196F3);
        case 'yellow':
          return Color(0xFFFFEB3B);
        case 'orange':
          return Color(0xFFFF9800);
        case 'purple':
          return Color(0xFF9C27B0);
        case 'pink':
          return Color(0xFFE91E63);
        case 'brown':
          return Color(0xFF795548);
        case 'grey':
        case 'gray':
          return Color(0xFF9E9E9E);
        case 'black':
          return Color(0xFF000000);
        case 'white':
          return Color(0xFFFFFFFF);
        default:
          return Color(0xFF2196F3); // Default to blue
      }
    }
  }
}
