import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:korecha/components/cart_button.dart';
import 'package:korecha/components/custom_modal_bottom_sheet.dart';
import 'package:korecha/components/network_image_with_loader.dart';
import 'package:korecha/constants.dart';
import 'package:korecha/features/cart/presentation/state/cart/bloc/cart_bloc.dart';
import 'package:korecha/features/product/data/models/product_model.dart';
import 'package:korecha/features/product/domain/entities/product.dart';
// import 'package:shop/screens/product/views/added_to_cart_message_screen.dart';
import 'package:korecha/screens/product/views/components/product_quantity.dart';
import 'package:korecha/screens/product/views/components/selected_colors.dart';
import 'package:korecha/screens/product/views/components/selected_size.dart';
import 'package:korecha/screens/product/views/components/unit_price.dart';

import '../../../../cart/domain/entities/cart_item.dart';
import 'added_to_cart_message_screen.dart';

class ProductBuyNowScreen extends StatefulWidget {
  final Product product;
  const ProductBuyNowScreen({super.key, required this.product});

  @override
  State<ProductBuyNowScreen> createState() => ProductBuyNowScreenState();
}

class ProductBuyNowScreenState extends State<ProductBuyNowScreen> {
  String? selectedColor;
  String? selectedSize;
  int _quantity = 1;
  int selectedColorIndex = 0;
  int selectedSizeIndex = 0;

  @override
  void initState() {
    super.initState();
    // Initialize with first color and size if available
    if (widget.product.colors.isNotEmpty) {
      selectedColor = widget.product.colors.first;
      selectedColorIndex = 0;
    }
    if (widget.product.sizes.isNotEmpty) {
      selectedSize = widget.product.sizes.first;
      selectedSizeIndex = 0;
    }
  }

  @override
  Widget build(BuildContext context) {
    List<String> sizes = widget.product.sizes;
    List<Color> colors =
        widget.product.colors.isEmpty
            ? []
            : widget.product.colors.map((colorStr) {
              return ProductModel.parseColor(colorStr);
            }).toList();

    return Scaffold(
      bottomNavigationBar: CartButton(
        price: widget.product.price * _quantity,
        title: "Add to cart",
        subTitle: "Total price",
        press: () {
          // Print selected values for debugging
          print('Selected color: $selectedColor');
          print('Selected size: $selectedSize');

          context.read<CartBloc>().add(
            AddToCart(
              CartItem(
                id: widget.product.id,
                productId: widget.product.id,
                name: widget.product.name,
                price: widget.product.price,
                coverUrl: widget.product.coverUrl,
                quantity: _quantity,
                color: selectedColor,
                size: selectedSize,
                address: '', // Default empty address for cart items
              ),
            ),
          );
          customModalBottomSheet(
            context,
            isDismissible: false,
            child: const AddedToCartMessageScreen(),
          );
        },
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: defaultPadding / 2,
              vertical: defaultPadding,
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const BackButton(),
                Text(
                  widget.product.name,
                  style: Theme.of(context).textTheme.titleSmall,
                ),
                IconButton(
                  onPressed: () {},
                  icon: SvgPicture.asset(
                    "assets/icons/Bookmark.svg",
                    colorFilter: ColorFilter.mode(
                      Theme.of(context).textTheme.bodyLarge!.color!,
                      BlendMode.srcIn,
                    ),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: CustomScrollView(
              slivers: [
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: defaultPadding,
                    ),
                    child: AspectRatio(
                      aspectRatio: 1.05,
                      child: NetworkImageWithLoader(widget.product.coverUrl),
                    ),
                  ),
                ),
                SliverPadding(
                  padding: const EdgeInsets.all(defaultPadding),
                  sliver: SliverToBoxAdapter(
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: UnitPrice(
                            price: widget.product.price,
                            priceAfterDiscount: widget.product.price,
                          ),
                        ),
                        ProductQuantity(
                          numOfItem: _quantity,
                          onIncrement: () {
                            setState(() {
                              _quantity++;
                            });
                          },
                          onDecrement: () {
                            setState(() {
                              _quantity--;
                            });
                          },
                        ),
                      ],
                    ),
                  ),
                ),
                const SliverToBoxAdapter(child: Divider()),
                if (widget.product.colors.isNotEmpty)
                  SliverToBoxAdapter(
                    child: SelectedColors(
                      colors: colors,
                      selectedColorIndex: selectedColorIndex,
                      press: (index) {
                        setState(() {
                          selectedColor = widget.product.colors[index];
                          selectedColorIndex = index;
                        });
                      },
                    ),
                  ),
                if (widget.product.sizes.isNotEmpty)
                  SliverToBoxAdapter(
                    child: SelectedSize(
                      sizes: sizes,
                      selectedIndex: selectedSizeIndex,
                      press: (index) {
                        setState(() {
                          selectedSize = sizes[index];
                          selectedSizeIndex = index;
                        });
                      },
                    ),
                  ),
                if (widget.product.additionalInfo != null &&
                    widget.product.additionalInfo is Map)
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.all(defaultPadding),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "Additional Information",
                            style: Theme.of(context).textTheme.titleSmall,
                          ),
                          const SizedBox(height: defaultPadding),
                          ...List.generate(
                            (widget.product.additionalInfo as Map)
                                .entries
                                .length,
                            (index) {
                              final entry = (widget.product.additionalInfo
                                      as Map)
                                  .entries
                                  .elementAt(index);
                              return Padding(
                                padding: const EdgeInsets.only(bottom: 8.0),
                                child: Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      "${entry.key}: ",
                                      style: Theme.of(
                                        context,
                                      ).textTheme.bodyMedium?.copyWith(
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    Expanded(
                                      child: Text(
                                        entry.value.toString(),
                                        style:
                                            Theme.of(
                                              context,
                                            ).textTheme.bodyMedium,
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                const SliverToBoxAdapter(
                  child: SizedBox(height: defaultPadding),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
