import '../entities/product.dart';
import '../usecases/get_filtered_products.dart';

class ProductFilterService {
  /// Filters products into different categories based on business logic
  Map<ProductFilter, List<Product>> filterProducts(List<Product> allProducts) {
    final Map<ProductFilter, List<Product>> filteredProducts = {};

    // All products
    filteredProducts[ProductFilter.allProducts] = List.from(allProducts);

    // Popular Products - Products with high ratings or many reviews
    filteredProducts[ProductFilter.popularProducts] =
        allProducts
            .where(
              (product) =>
                  product.reviewSummary?.averageRating != null &&
                      product.reviewSummary!.averageRating >= 4.0 ||
                  product.reviewSummary?.totalReviews != null &&
                      product.reviewSummary!.totalReviews >= 5 ||
                  product.totalSold > 10,
            )
            .toList();

    // Hot Deals - Products with discounts or high sales
    filteredProducts[ProductFilter.hotDeals] =
        allProducts
            .where(
              (product) =>
                  product.priceSale != null &&
                      product.priceSale! < product.price ||
                  product.totalSold > 5,
            )
            .toList();

    // Countdown Products - Products with limited quantity or recent additions
    filteredProducts[ProductFilter.countDownProducts] =
        allProducts
            .where(
              (product) =>
                  product.quantity > 0 && product.quantity <= 20 ||
                  _isRecentProduct(product),
            )
            .toList();

    // Featured Products - Top-rated products with good reviews
    filteredProducts[ProductFilter.featured] =
        allProducts
            .where(
              (product) =>
                  product.reviewSummary?.averageRating != null &&
                      product.reviewSummary!.averageRating >= 4.5 ||
                  product.totalSold > 15,
            )
            .toList();

    // Top Brands - Products from established brands (non-empty brand field)
    filteredProducts[ProductFilter.topBrands] =
        allProducts
            .where(
              (product) =>
                  product.brand.name.isNotEmpty &&
                  product.brand.name.toLowerCase() != 'unknown' &&
                  product.brand.name.toLowerCase() != 'generic',
            )
            .toList();

    // Special Offers - Products with significant discounts
    filteredProducts[ProductFilter.specialOffers] =
        allProducts
            .where(
              (product) =>
                  product.priceSale != null &&
                  _getDiscountPercentage(product) >= 20,
            )
            .toList();

    // Top Products - Combination of high ratings and sales
    filteredProducts[ProductFilter.topProducts] =
        allProducts
            .where(
              (product) =>
                  (product.reviewSummary?.averageRating ?? 0) >= 4.0 &&
                  product.totalSold > 8,
            )
            .toList();

    // Apply fallback logic for empty categories
    _applyFallbackLogic(filteredProducts, allProducts);

    // Ensure equal distribution and avoid overlaps
    _ensureEqualDistributionAndAvoidOverlaps(filteredProducts, allProducts);

    return filteredProducts;
  }

  /// Checks if a product was created recently (within last 30 days)
  bool _isRecentProduct(Product product) {
    final now = DateTime.now();
    final thirtyDaysAgo = now.subtract(const Duration(days: 30));
    return product.createdAt.isAfter(thirtyDaysAgo);
  }

  /// Calculates discount percentage using the new formula
  double _getDiscountPercentage(Product product) {
    if (product.priceSale == null || product.priceSale! >= product.price) {
      return 0.0;
    }

    final average = (product.priceSale! + product.price) / 2;
    if (average == 0) return 0.0;

    return ((product.priceSale! - average) / average * 100).abs();
  }

  /// Applies fallback logic when categories are empty
  void _applyFallbackLogic(
    Map<ProductFilter, List<Product>> filteredProducts,
    List<Product> allProducts,
  ) {
    // If any category is empty, use alternative logic
    filteredProducts.forEach((filter, products) {
      if (products.isEmpty) {
        switch (filter) {
          case ProductFilter.popularProducts:
            // Fallback: Products with any reviews or sales
            filteredProducts[filter] =
                allProducts
                    .where(
                      (p) =>
                          p.reviewSummary?.totalReviews != null &&
                              p.reviewSummary!.totalReviews > 0 ||
                          p.totalSold > 0,
                    )
                    .toList();
            break;

          case ProductFilter.hotDeals:
            // Fallback: Products with any discount or recent products
            filteredProducts[filter] =
                allProducts
                    .where((p) => p.priceSale != null || _isRecentProduct(p))
                    .toList();
            break;

          case ProductFilter.countDownProducts:
            // Fallback: Products with low quantity or any sales
            filteredProducts[filter] =
                allProducts
                    .where((p) => p.quantity <= 50 || p.totalSold > 0)
                    .toList();
            break;

          case ProductFilter.featured:
            // Fallback: Products with any rating or brand
            filteredProducts[filter] =
                allProducts
                    .where(
                      (p) =>
                          p.reviewSummary?.averageRating != null ||
                          p.brand.name.isNotEmpty,
                    )
                    .toList();
            break;

          case ProductFilter.topBrands:
            // Fallback: Products with any brand information
            filteredProducts[filter] =
                allProducts.where((p) => p.brand.name.isNotEmpty).toList();
            break;

          case ProductFilter.specialOffers:
            // Fallback: Any products with sale price
            filteredProducts[filter] =
                allProducts.where((p) => p.priceSale != null).toList();
            break;

          case ProductFilter.topProducts:
            // Fallback: Products with any positive metrics
            filteredProducts[filter] =
                allProducts
                    .where(
                      (p) =>
                          p.totalSold > 0 ||
                          p.reviewSummary?.totalReviews != null &&
                              p.reviewSummary!.totalReviews > 0,
                    )
                    .toList();
            break;

          default:
            // For any other empty category, use a subset of all products
            filteredProducts[filter] = allProducts.take(10).toList();
        }
      }
    });

    // Final fallback: if still empty, use random products
    filteredProducts.forEach((filter, products) {
      if (products.isEmpty && allProducts.isNotEmpty) {
        final shuffled = List<Product>.from(allProducts)..shuffle();
        filteredProducts[filter] = shuffled.take(5).toList();
      }
    });
  }

  /// Shuffles products and limits to reasonable numbers for UI
  void _shuffleAndLimitProducts(
    Map<ProductFilter, List<Product>> filteredProducts,
  ) {
    filteredProducts.forEach((filter, products) {
      if (products.isNotEmpty) {
        // Shuffle for variety
        products.shuffle();

        // Limit to reasonable numbers for UI performance
        final maxItems = _getMaxItemsForFilter(filter);
        if (products.length > maxItems) {
          filteredProducts[filter] = products.take(maxItems).toList();
        }
      }
    });
  }

  /// Gets maximum items to show for each filter type
  int _getMaxItemsForFilter(ProductFilter filter) {
    switch (filter) {
      case ProductFilter.allProducts:
        return 50; // Keep more for general browsing
      case ProductFilter.popularProducts:
      case ProductFilter.hotDeals:
      case ProductFilter.countDownProducts:
        return 15; // Good for horizontal scrolling
      case ProductFilter.featured:
      case ProductFilter.topProducts:
        return 12;
      case ProductFilter.topBrands:
      case ProductFilter.specialOffers:
        return 10;
      default:
        return 10;
    }
  }

  /// Sorts products by relevance for each category
  void sortProductsByRelevance(
    Map<ProductFilter, List<Product>> filteredProducts,
  ) {
    filteredProducts.forEach((filter, products) {
      switch (filter) {
        case ProductFilter.popularProducts:
          products.sort((a, b) {
            final aRating = a.reviewSummary?.averageRating ?? 0;
            final bRating = b.reviewSummary?.averageRating ?? 0;
            final aReviews = a.reviewSummary?.totalReviews ?? 0;
            final bReviews = b.reviewSummary?.totalReviews ?? 0;

            // Sort by rating first, then by number of reviews
            final ratingComparison = bRating.compareTo(aRating);
            return ratingComparison != 0
                ? ratingComparison
                : bReviews.compareTo(aReviews);
          });
          break;

        case ProductFilter.hotDeals:
          products.sort((a, b) {
            final aDiscount = _getDiscountPercentage(a);
            final bDiscount = _getDiscountPercentage(b);
            final discountComparison = bDiscount.compareTo(aDiscount);
            return discountComparison != 0
                ? discountComparison
                : b.totalSold.compareTo(a.totalSold);
          });
          break;

        case ProductFilter.countDownProducts:
          products.sort((a, b) {
            // Sort by quantity (ascending) and creation date (descending)
            final quantityComparison = a.quantity.compareTo(b.quantity);
            return quantityComparison != 0
                ? quantityComparison
                : b.createdAt.compareTo(a.createdAt);
          });
          break;

        case ProductFilter.topProducts:
          products.sort((a, b) {
            final aScore = _calculateProductScore(a);
            final bScore = _calculateProductScore(b);
            return bScore.compareTo(aScore);
          });
          break;

        default:
          // Default sort by creation date (newest first)
          products.sort((a, b) => b.createdAt.compareTo(a.createdAt));
      }
    });
  }

  /// Calculates a composite score for products
  double _calculateProductScore(Product product) {
    double score = 0.0;

    // Rating contribution (0-5 points)
    if (product.reviewSummary?.averageRating != null) {
      score += product.reviewSummary!.averageRating;
    }

    // Reviews contribution (0-2 points)
    if (product.reviewSummary?.totalReviews != null) {
      score += (product.reviewSummary!.totalReviews / 10).clamp(0, 2);
    }

    // Sales contribution (0-3 points)
    score += (product.totalSold / 10).clamp(0, 3);

    // Discount contribution (0-1 point)
    score += (_getDiscountPercentage(product) / 100).clamp(0, 1);

    return score;
  }

  /// Ensures equal distribution across categories and guarantees no empty sections
  void _ensureEqualDistributionAndAvoidOverlaps(
    Map<ProductFilter, List<Product>> filteredProducts,
    List<Product> allProducts,
  ) {
    if (allProducts.isEmpty) return;

    // Define the main sections that should have equal distribution
    final mainSections = [
      ProductFilter.popularProducts,
      ProductFilter.hotDeals,
      ProductFilter.countDownProducts,
    ];

    // Target number of products per section
    final int targetProductsPerSection = _calculateOptimalProductsPerSection(
      allProducts.length,
    );

    // Guarantee minimum of 3 products per section if we have more than 3 products total
    final int minimumProductsPerSection = allProducts.length > 3 ? 3 : 1;

    // Keep track of used products to minimize overlaps (but allow reuse if needed)
    final Set<String> preferredUniqueIds = {};

    // First pass: Sort each category by relevance
    sortProductsByRelevance(filteredProducts);

    // Second pass: Ensure equal distribution for main sections
    for (final filter in mainSections) {
      final products = filteredProducts[filter] ?? [];
      final availableProducts = <Product>[];

      // Priority 1: Get products that haven't been used yet and match criteria
      for (final product in products) {
        if (!preferredUniqueIds.contains(product.id)) {
          availableProducts.add(product);
        }
      }

      // Priority 2: If we don't have enough, get more from all products that match criteria
      if (availableProducts.length < targetProductsPerSection) {
        for (final product in allProducts) {
          if (!preferredUniqueIds.contains(product.id) &&
              !availableProducts.any((p) => p.id == product.id)) {
            // Check if product fits the category (relaxed criteria)
            bool fits = false;
            switch (filter) {
              case ProductFilter.popularProducts:
                fits =
                    product.reviewSummary?.averageRating != null ||
                    product.reviewSummary?.totalReviews != null ||
                    product.totalSold > 0 ||
                    product.priceSale != null; // More relaxed
                break;
              case ProductFilter.hotDeals:
                fits =
                    product.priceSale != null ||
                    product.totalSold > 0 ||
                    _isRecentProduct(product); // More relaxed
                break;
              case ProductFilter.countDownProducts:
                fits =
                    product.quantity <= 50 ||
                    _isRecentProduct(product) ||
                    product.totalSold > 0; // More relaxed
                break;
              default:
                fits = true;
            }

            if (fits) {
              availableProducts.add(product);
              if (availableProducts.length >= targetProductsPerSection) {
                break;
              }
            }
          }
        }
      }

      // Priority 3: If still not enough, reuse products from other sections
      if (availableProducts.length < targetProductsPerSection) {
        final shuffledAll = allProducts.toList()..shuffle();

        for (final product in shuffledAll) {
          if (!availableProducts.any((p) => p.id == product.id)) {
            availableProducts.add(product);
            if (availableProducts.length >= targetProductsPerSection) {
              break;
            }
          }
        }
      }

      // Priority 4: Guarantee minimum products per section if we have enough total products
      if (availableProducts.length < minimumProductsPerSection &&
          allProducts.length > 3) {
        final shuffledAll = allProducts.toList()..shuffle();

        for (final product in shuffledAll) {
          if (!availableProducts.any((p) => p.id == product.id)) {
            availableProducts.add(product);
            if (availableProducts.length >= minimumProductsPerSection) {
              break;
            }
          }
        }
      }

      // Shuffle to avoid same order across sections
      availableProducts.shuffle();

      // Take the target number of products, but ensure we have at least the minimum
      final productsToTake =
          availableProducts.length >= targetProductsPerSection
              ? targetProductsPerSection
              : availableProducts.length.clamp(
                minimumProductsPerSection,
                availableProducts.length,
              );

      final selectedProducts = availableProducts.take(productsToTake).toList();

      // Mark these products as preferred unique (but allow reuse if needed)
      for (final product in selectedProducts.take(
        (selectedProducts.length * 0.7).round(),
      )) {
        preferredUniqueIds.add(product.id);
      }

      // Update the filtered products
      filteredProducts[filter] = selectedProducts;
    }

    // Third pass: Handle other categories with remaining products
    final otherFilters = ProductFilter.values.where(
      (f) => !mainSections.contains(f) && f != ProductFilter.allProducts,
    );

    for (final filter in otherFilters) {
      final products = filteredProducts[filter] ?? [];
      final availableProducts = <Product>[];

      // Get products that haven't been used yet (preferred)
      for (final product in products) {
        if (!preferredUniqueIds.contains(product.id)) {
          availableProducts.add(product);
        }
      }

      // If we need more products, get from any available products
      final targetForOther = _getMaxItemsForFilter(filter);
      if (availableProducts.length < targetForOther) {
        final shuffledAll = allProducts.toList()..shuffle();
        for (final product in shuffledAll) {
          if (!availableProducts.any((p) => p.id == product.id)) {
            availableProducts.add(product);
            if (availableProducts.length >= targetForOther) break;
          }
        }
      }

      // Shuffle and limit
      availableProducts.shuffle();
      filteredProducts[filter] =
          availableProducts.take(targetForOther).toList();
    }

    // Final pass: Ensure allProducts contains all unique products
    final allUniqueProducts = allProducts.toList()..shuffle();
    filteredProducts[ProductFilter.allProducts] =
        allUniqueProducts.take(50).toList();

    // Emergency fallback: If any main section is still empty or below minimum, fill with random products
    for (final filter in mainSections) {
      final currentProducts = filteredProducts[filter] ?? [];
      if (currentProducts.length < minimumProductsPerSection &&
          allProducts.isNotEmpty) {
        final shuffled = allProducts.toList()..shuffle();
        final needed = minimumProductsPerSection - currentProducts.length;
        final additionalProducts = shuffled.take(needed).toList();

        // Combine existing products with additional ones, avoiding duplicates
        final combinedProducts = <Product>[...currentProducts];
        for (final product in additionalProducts) {
          if (!combinedProducts.any((p) => p.id == product.id)) {
            combinedProducts.add(product);
          }
        }

        filteredProducts[filter] =
            combinedProducts.take(targetProductsPerSection).toList();
      }
    }
  }

  /// Calculates optimal number of products per section based on total available products
  int _calculateOptimalProductsPerSection(int totalProducts) {
    if (totalProducts <= 3) {
      // If we have 3 or fewer products, distribute them as evenly as possible
      return 1;
    } else if (totalProducts < 15) {
      // If we have more than 3 products, guarantee at least 3 per section
      return (totalProducts / 3).floor().clamp(3, 4);
    } else if (totalProducts < 30) {
      return 6;
    } else if (totalProducts < 50) {
      return 8;
    } else {
      return 10;
    }
  }
}
