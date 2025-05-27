class PriceUtils {
  /// Calculate the display price (selling price if available, otherwise base price)
  static double getDisplayPrice(double basePrice, double? sellingPrice) {
    return sellingPrice ?? basePrice;
  }

  /// Calculate the original price for comparison (base price)
  static double getOriginalPrice(double basePrice, double? sellingPrice) {
    return basePrice;
  }

  /// Calculate discount percentage using the new formula:
  /// (selling_price - average_of_selling_and_base) / average_of_selling_and_base * 100
  static int? calculateDiscountPercentage(
    double basePrice,
    double? sellingPrice,
  ) {
    if (sellingPrice == null || sellingPrice >= basePrice) {
      return null; // No discount
    }

    final average = (sellingPrice + basePrice) / 2;
    if (average == 0) return null;

    final discountPercentage =
        ((sellingPrice - average) / average * 100).abs().round();
    return discountPercentage > 0 ? discountPercentage : null;
  }

  /// Check if there's a valid discount
  static bool hasDiscount(double basePrice, double? sellingPrice) {
    return sellingPrice != null && sellingPrice < basePrice;
  }
}
