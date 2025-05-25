import '../../domain/entities/product.dart';
import '../../domain/entities/product_entities.dart';
import '../../domain/entities/review.dart' as review_entities;
import '../models/category_model.dart';
import '../models/review_model.dart';

class ProductModel extends Product {
  final String? categoryId;

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
    super.reviewSummary,
    this.categoryId,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    try {
      // Handle category field which is now an object instead of string
      String categoryName = "uncategorized";
      String? categoryId;
      if (json['category'] != null &&
          json['category'] is Map<String, dynamic>) {
        categoryName = json['category']['name'] as String? ?? 'uncategorized';
        categoryId = json['category']['id'] as String?;
      }

      // Parse review summary from the API response
      review_entities.ReviewSummary? reviewSummary;
      if (json['review'] != null && json['review'] is Map<String, dynamic>) {
        reviewSummary = ReviewSummaryModel.fromJson(json['review']);
      }

      return ProductModel(
        id: json['id'] as String? ?? '',
        name: json['name'] as String? ?? '',
        sku: json['sku'] as String?,
        code: json['code'] as String?,
        description: json['description'] as String? ?? '',
        subDescription: json['short_description'] as String? ?? '',
        publish: json['is_public'] == true ? 'published' : 'draft',
        price: double.tryParse(json['base_price']?.toString() ?? '0.0') ?? 0.0,
        priceSale:
            json['selling_price'] != null
                ? double.tryParse(json['selling_price']!.toString())
                : null,
        taxes: 0.0, // Default value as the API doesn't return taxes
        coverUrl: json['cover_url'] as String? ?? '',
        tags:
            (json['tag'] as List<dynamic>?)
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
        gender: [], // Default value as the API doesn't return gender
        inventoryType:
            json['quantity'] != null && (json['quantity'] as int) > 0
                ? 'in_stock'
                : 'out_of_stock',
        quantity: json['quantity'] as int? ?? 0,
        available: json['quantity'] as int? ?? 0,
        totalSold: json['total_sold'] as int? ?? 0,
        totalRatings: reviewSummary?.averageRating ?? 0.0,
        totalReviews: reviewSummary?.totalReviews ?? 0,
        images: _parseImages(json['images']),
        vendor: Vendor(name: json['owner'] as String? ?? ''),
        category: categoryName,
        reviews:
            [], // Default value as the API doesn't return individual reviews in product details
        ratings: [], // Default value as the API doesn't return ratings
        newLabel: Label(enabled: false), // Default value
        saleLabel: SaleLabel(enabled: false), // Default value
        createdAt:
            json['created_at'] != null
                ? DateTime.parse(json['created_at'].toString())
                : DateTime.now(),
        brand: Brand(name: json['brand'] as String? ?? ''),
        reviewSummary: reviewSummary,
        categoryId: categoryId,
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
}
