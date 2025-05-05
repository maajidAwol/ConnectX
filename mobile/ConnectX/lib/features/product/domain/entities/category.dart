


class Category {
  final String id;
  final String name;
  final String slug;
  final String group;
  final String description;
  final String? coverImg;
  final bool isActive;
  final List<Category>? children;
  final DateTime createdAt;
  final DateTime updatedAt;

  Category({
    required this.id,
    required this.name,
    required this.slug,
    required this.group,
    required this.description,
    this.coverImg,
    required this.isActive,
    this.children,
    required this.createdAt,
    required this.updatedAt,
  });
}