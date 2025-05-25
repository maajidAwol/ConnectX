import 'package:korecha/features/product/domain/entities/category.dart';

class CategoryModel extends Category {
  CategoryModel({
    required super.id,
    required super.name,
    required super.slug,
    required super.group,
    required super.description,
    super.coverImg,
    required super.isActive,
    List<CategoryModel>? super.children,
    required super.createdAt,
    required super.updatedAt,
  });

  factory CategoryModel.fromJson(Map<String, dynamic> json) {
    return CategoryModel(
      id: json['id'].toString(),
      name: json['name'] as String? ?? '',
      slug:
          json['slug'] as String? ??
          json['name']?.toString()?.toLowerCase().replaceAll(' ', '-') ??
          '',
      group: json['tenant'] != null ? json['tenant'].toString() : '',
      description: json['description'] as String? ?? '',
      coverImg: json['icon'] as String?,
      isActive: true, // Default as API doesn't have isActive field
      children: null, // No children in current API response
      createdAt:
          json['created_at'] != null
              ? DateTime.parse(json['created_at'].toString())
              : DateTime.now(),
      updatedAt:
          json['updated_at'] != null
              ? DateTime.parse(json['updated_at'].toString())
              : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'slug': slug,
      'group': group,
      'description': description,
      'coverImg': coverImg,
      'isActive': isActive,
      'children':
          children?.map((child) => (child as CategoryModel).toJson()).toList(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}
