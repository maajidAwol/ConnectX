// Shared entity classes used by both Product and ProductModel
class ProductImage {
  final String url;
  ProductImage({required this.url});
}

class Vendor {
  final String name;
  final String? logo;
  Vendor({required this.name, this.logo});
  
  factory Vendor.empty() => Vendor(name: '');
}

class Brand {
  final String name;
  final String? logo;
  Brand({required this.name, this.logo});
  
  factory Brand.empty() => Brand(name: '');
}

class Review {
  final String id;
  final String content;
  Review({required this.id, required this.content});
}

class Rating {
  final double value;
  
  Rating({required this.value});

}

class Label {
  final bool enabled;
  final String? text;
  Label({required this.enabled, this.text});
  
  factory Label.empty() => Label(enabled: false);
}

class SaleLabel {
  final bool enabled;
  final String? text;
  SaleLabel({required this.enabled, this.text});
  
  factory SaleLabel.empty() => SaleLabel(enabled: false);
} 