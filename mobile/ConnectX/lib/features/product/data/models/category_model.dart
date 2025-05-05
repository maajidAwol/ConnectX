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
      name: json['name'],
      slug: json['slug'],
      group: json['group'],
      description: json['description'],
      coverImg: json['coverImg'],
      isActive: json['isActive'],
      children:
          (json['children'] as List?)
              ?.map((child) => CategoryModel.fromJson(child))
              .toList(),
      createdAt:
          json['createdAt'] is String
              ? DateTime.parse(json['createdAt'])
              : DateTime.now(),
      updatedAt:
          json['updatedAt'] is String
              ? DateTime.parse(json['updatedAt'])
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
