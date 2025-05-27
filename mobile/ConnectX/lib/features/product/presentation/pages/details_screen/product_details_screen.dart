import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/svg.dart';
import 'package:korecha/components/cart_button.dart';
import 'package:korecha/components/product/product_card.dart';
import 'package:korecha/components/review_card.dart';
import 'package:korecha/components/reviews_bottom_sheet.dart';
import 'package:korecha/components/skleton/product/products_skelton.dart';
import 'package:korecha/constants.dart';
import 'package:korecha/features/product/domain/usecases/get_filtered_products.dart';
import 'package:korecha/features/product/presentation/state/details/bloc/details_bloc.dart';
import 'package:korecha/features/product/presentation/state/home/bloc/home_bloc.dart';
import 'package:korecha/features/product/presentation/widgets/details/custom_modal_bottom_sheet.dart';
import 'package:korecha/features/product/presentation/widgets/details/product_buy_now_screen.dart';
import 'package:korecha/features/product/presentation/widgets/details/product_details_shimmer.dart';
import 'package:korecha/screens/product/views/components/notify_me_card.dart';
import 'package:korecha/screens/product/views/components/product_images.dart';
import 'package:korecha/screens/product/views/components/product_info.dart';
import 'package:korecha/features/product/presentation/pages/add_review_screen.dart';
import 'package:korecha/features/product/data/models/review_model.dart';
import 'package:korecha/features/product/data/models/product_model.dart';
import 'package:korecha/features/product/domain/entities/review.dart'
    as review_entities;
import 'package:korecha/core/injection/injection_container.dart';
import 'package:korecha/features/product/data/datasources/product_remote_data_source.dart';
import 'package:korecha/utils/price_utils.dart';

import 'package:korecha/route/screen_export.dart';

class ProductDetailsScreen extends StatefulWidget {
  const ProductDetailsScreen({
    super.key,
    this.isProductAvailable = true,
    required this.productId,
  });

  final bool isProductAvailable;
  final String productId;

  @override
  State<ProductDetailsScreen> createState() => _ProductDetailsScreenState();
}

class _ProductDetailsScreenState extends State<ProductDetailsScreen> {
  List<review_entities.Review> _reviews = [];
  bool _loadingReviews = false;
  List<ProductModel> _relatedProducts = [];
  bool _loadingRelatedProducts = false;
  bool _relatedProductsError = false;
  String? _lastLoadedCategoryId;

  @override
  void initState() {
    super.initState();
    context.read<DetailsBloc>().add(
      LoadProductDetails(productId: widget.productId),
    );
    _loadReviews();
  }

  @override
  void didUpdateWidget(ProductDetailsScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    // Reset related products state when product ID changes
    if (oldWidget.productId != widget.productId) {
      setState(() {
        _relatedProducts = [];
        _loadingRelatedProducts = false;
        _relatedProductsError = false;
        _lastLoadedCategoryId = null;
      });
      context.read<DetailsBloc>().add(
        LoadProductDetails(productId: widget.productId),
      );
      _loadReviews();
    }
  }

  @override
  void dispose() {
    // Cancel any ongoing operations to prevent setState after dispose
    super.dispose();
  }

  Future<void> _loadReviews() async {
    if (!mounted) return;

    setState(() {
      _loadingReviews = true;
    });

    try {
      final dataSource = sl<ProductRemoteDataSource>();
      final reviewModels = await dataSource.getProductReviews(widget.productId);

      if (mounted) {
        setState(() {
          _reviews = reviewModels.cast<review_entities.Review>();
          _loadingReviews = false;
        });
      }
    } catch (e) {
      print('Error loading reviews: $e');
      if (mounted) {
        setState(() {
          _loadingReviews = false;
        });
      }
    }
  }

  Future<void> _loadRelatedProducts(String categoryId) async {
    if (!mounted) return;

    // Avoid loading the same category multiple times
    if (_lastLoadedCategoryId == categoryId &&
        (_relatedProducts.isNotEmpty || _relatedProductsError)) {
      return;
    }

    setState(() {
      _loadingRelatedProducts = true;
      _relatedProductsError = false;
      _lastLoadedCategoryId = categoryId;
    });

    try {
      final dataSource = sl<ProductRemoteDataSource>();
      final products = await dataSource.getProductsByCategoryId(categoryId);

      // Filter out the current product
      final filteredProducts =
          products.where((product) => product.id != widget.productId).toList();

      if (mounted) {
        setState(() {
          _relatedProducts = filteredProducts;
          _loadingRelatedProducts = false;
          _relatedProductsError = false;
        });
      }
    } catch (e) {
      print('Error loading related products: $e');
      if (mounted) {
        setState(() {
          _relatedProducts = [];
          _loadingRelatedProducts = false;
          _relatedProductsError = true;
        });
      }
    }
  }

  void _navigateToAddReview(String productId, String productName) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder:
            (context) => AddReviewScreen(
              productId: productId,
              productName: productName,
              onReviewSubmitted: () {
                // Refresh product details to get updated review data
                context.read<DetailsBloc>().add(
                  LoadProductDetails(productId: widget.productId),
                );
                _loadReviews(); // Also refresh the reviews list
              },
            ),
      ),
    );

    // If a review was submitted, refresh the data
    if (result == true) {
      _loadReviews();
    }
  }

  void _showReviews() {
    ReviewsBottomSheet.show(
      context,
      reviews: _reviews,
      productId: widget.productId,
      onWriteReview:
          () => _navigateToAddReview(
            widget.productId,
            context.read<DetailsBloc>().state is DetailsLoaded
                ? (context.read<DetailsBloc>().state as DetailsLoaded)
                    .product
                    .name
                : 'Product',
          ),
    );
  }

  Widget _buildRelatedProductsSection() {
    if (_loadingRelatedProducts) {
      return const ProductsSkelton();
    }

    if (_relatedProductsError) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.error_outline, size: 48, color: Colors.grey[400]),
            const SizedBox(height: 8),
            Text(
              'Failed to load related products',
              style: Theme.of(
                context,
              ).textTheme.bodyMedium?.copyWith(color: Colors.grey[600]),
            ),
            const SizedBox(height: 8),
            TextButton(
              onPressed: () {
                if (_lastLoadedCategoryId != null) {
                  setState(() {
                    _relatedProductsError = false;
                    _lastLoadedCategoryId = null;
                  });
                  _loadRelatedProducts(_lastLoadedCategoryId!);
                }
              },
              child: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    if (_relatedProducts.isEmpty) {
      return const Center(child: Text('No related products available'));
    }

    return ListView.builder(
      scrollDirection: Axis.horizontal,
      itemCount: _relatedProducts.length,
      itemBuilder:
          (context, index) => Padding(
            padding: EdgeInsets.only(
              left: defaultPadding,
              right: index == _relatedProducts.length - 1 ? defaultPadding : 0,
            ),
            child: ProductCard(
              image: _relatedProducts[index].coverUrl,
              brandName: _relatedProducts[index].name,
              title: _relatedProducts[index].subDescription,
              price: _relatedProducts[index].price,
              priceAfetDiscount: _relatedProducts[index].priceSale,
              dicountpercent: PriceUtils.calculateDiscountPercentage(
                _relatedProducts[index].price,
                _relatedProducts[index].priceSale,
              ),
              press: () {
                Navigator.pushNamed(
                  context,
                  productDetailsScreenRoute,
                  arguments: {
                    'isProductAvailable': true,
                    'productId': _relatedProducts[index].id,
                  },
                );
              },
            ),
          ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<DetailsBloc, DetailsState>(
      builder: (context, state) {
        if (state is DetailsLoading) {
          return const ProductDetailsShimmer();
        }
        if (state is DetailsError) {
          return Center(child: Text(state.message));
        }
        if (state is DetailsLoaded) {
          // Load related products when product details are loaded
          final productModel = state.product;
          if (!_loadingRelatedProducts &&
              productModel is ProductModel &&
              productModel.categoryId != null &&
              productModel.categoryId!.isNotEmpty &&
              _lastLoadedCategoryId != productModel.categoryId) {
            WidgetsBinding.instance.addPostFrameCallback((_) {
              _loadRelatedProducts(productModel.categoryId!);
            });
          }

          return Scaffold(
            bottomNavigationBar:
                widget.isProductAvailable
                    ? CartButton(
                      price: state.product.priceSale ?? state.product.price,
                      press: () {
                        customModalBottomSheet(
                          context,
                          height: MediaQuery.of(context).size.height * 0.92,
                          child: ProductBuyNowScreen(product: state.product),
                        );
                      },
                    )
                    :
                    /// If profuct is not available then show [NotifyMeCard]
                    NotifyMeCard(isNotify: false, onChanged: (value) {}),
            body: SafeArea(
              child: CustomScrollView(
                slivers: [
                  SliverAppBar(
                    surfaceTintColor: Theme.of(context).scaffoldBackgroundColor,
                    backgroundColor: Theme.of(context).scaffoldBackgroundColor,
                    floating: false,
                    pinned: true,
                    elevation: 0,
                    actions: [
                      // IconButton(
                      //   onPressed: () {},
                      //   icon: SvgPicture.asset(
                      //     "assets/icons/Bookmark.svg",
                      //     colorFilter: ColorFilter.mode(
                      //       Theme.of(context).textTheme.bodyLarge!.color!,
                      //       BlendMode.srcIn,
                      //     ),
                      //   ),
                      // ),
                    ],
                  ),
                  ProductImages(
                    images: [
                      if (state.product.coverUrl.isNotEmpty)
                        state.product.coverUrl,
                      ...state.product.images
                          .map((e) => e.url)
                          .where((url) => url.isNotEmpty),
                    ],
                  ),
                  ProductInfo(
                    brand: state.product.name,
                    title: state.product.subDescription,
                    isAvailable: widget.isProductAvailable,
                    description: state.product.description,
                    rating: state.product.reviewSummary?.averageRating ?? 0.0,
                    numOfReviews:
                        state.product.reviewSummary?.totalReviews ?? 0,
                  ),
                  // ProductListTile(
                  //   svgSrc: "assets/icons/Product.svg",
                  //   title: "Product Details",
                  //   press: () {
                  //     customModalBottomSheet(
                  //       context,
                  //       height: MediaQuery.of(context).size.height * 0.92,
                  //       child: const BuyFullKit(
                  //           images: ["assets/screens/Product detail.png"]),
                  //     );
                  //   },
                  // ),
                  // ProductListTile(
                  //   svgSrc: "assets/icons/Delivery.svg",
                  //   title: "Shipping Information",
                  //   press: () {
                  //     customModalBottomSheet(
                  //       context,
                  //       height: MediaQuery.of(context).size.height * 0.92,
                  //       child: const BuyFullKit(
                  //         images: ["assets/screens/Shipping information.png"],
                  //       ),
                  //     );
                  //   },
                  // ),
                  // ProductListTile(
                  //   svgSrc: "assets/icons/Return.svg",
                  //   title: "Returns",
                  //   isShowBottomBorder: true,
                  //   press: () {
                  //     customModalBottomSheet(
                  //       context,
                  //       height: MediaQuery.of(context).size.height * 0.92,
                  //       child: const ProductReturnsScreen(),
                  //     );
                  //   },
                  // ),
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.all(defaultPadding),
                      child: Column(
                        children: [
                          GestureDetector(
                            onTap: _showReviews,
                            child: ReviewCard(
                              rating:
                                  state.product.reviewSummary?.averageRating ??
                                  0.0,
                              numOfReviews:
                                  state.product.reviewSummary?.totalReviews ??
                                  0,
                              numOfFiveStar:
                                  state.product.reviewSummary?.fiveStarCount ??
                                  0,
                              numOfFourStar:
                                  state.product.reviewSummary?.fourStarCount ??
                                  0,
                              numOfThreeStar:
                                  state.product.reviewSummary?.threeStarCount ??
                                  0,
                              numOfTwoStar:
                                  state.product.reviewSummary?.twoStarCount ??
                                  0,
                              numOfOneStar:
                                  state.product.reviewSummary?.oneStarCount ??
                                  0,
                            ),
                          ),
                          const SizedBox(height: defaultPadding),
                          // Add Review Button
                          SizedBox(
                            width: double.infinity,
                            child: OutlinedButton.icon(
                              onPressed:
                                  () => _navigateToAddReview(
                                    state.product.id,
                                    state.product.name,
                                  ),
                              icon: const Icon(Icons.rate_review_outlined),
                              label: const Text('Write a Review'),
                              style: OutlinedButton.styleFrom(
                                padding: const EdgeInsets.symmetric(
                                  vertical: defaultPadding,
                                ),
                                side: BorderSide(
                                  color: Theme.of(context).primaryColor,
                                ),
                                foregroundColor: Theme.of(context).primaryColor,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  // ProductListTile(
                  //   svgSrc: "assets/icons/Chat.svg",
                  //   title: "Reviews",
                  //   isShowBottomBorder: true,
                  //   press: () {
                  //     Navigator.pushNamed(context, productReviewsScreenRoute);
                  //   },
                  // ),
                  SliverPadding(
                    padding: const EdgeInsets.all(defaultPadding),
                    sliver: SliverToBoxAdapter(
                      child: Text(
                        "You may also like",
                        style: Theme.of(context).textTheme.titleSmall!,
                      ),
                    ),
                  ),
                  SliverToBoxAdapter(
                    child: SizedBox(
                      height: 220,
                      child: _buildRelatedProductsSection(),
                    ),
                  ),
                  const SliverToBoxAdapter(
                    child: SizedBox(height: defaultPadding),
                  ),
                ],
              ),
            ),
          );
        }
        return const SizedBox.shrink();
      },
    );
  }
}
