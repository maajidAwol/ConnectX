import 'package:flutter/material.dart';

import '../../constants.dart';
import '../network_image_with_loader.dart';

class SecondaryProductCard extends StatelessWidget {
  const SecondaryProductCard({
    super.key,
    required this.image,
    required this.brandName,
    required this.title,
    required this.price,
    this.priceAfetDiscount,
    this.dicountpercent,
    this.press,
    this.style,
  });
  final String image, brandName, title;
  final double price;
  final double? priceAfetDiscount;
  final int? dicountpercent;
  final VoidCallback? press;

  final ButtonStyle? style;

  @override
  Widget build(BuildContext context) {
    return OutlinedButton(
      onPressed: () {},
      style:
          style ??
          OutlinedButton.styleFrom(
            minimumSize: const Size(256, 114),
            maximumSize: const Size(256, 130),
            padding: const EdgeInsets.all(6),
          ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          AspectRatio(
            aspectRatio: 1.15,
            child: Stack(
              children: [
                Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(defaultBorderRadious),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.blue.withOpacity(0.1),
                        blurRadius: 100,
                        offset: const Offset(0, 1),
                      ),
                    ],
                  ),
                  child: NetworkImageWithLoader(
                    image,
                    radius: defaultBorderRadious,
                  ),
                ),
                if (dicountpercent != null)
                  Positioned(
                    right: defaultPadding / 2,
                    top: defaultPadding / 2,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: defaultPadding / 2,
                      ),
                      height: 16,
                      decoration: const BoxDecoration(
                        color: errorColor,
                        borderRadius: BorderRadius.all(
                          Radius.circular(defaultBorderRadious),
                        ),
                      ),
                      child: Text(
                        "$dicountpercent% off",
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(width: defaultPadding / 4),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    brandName.toUpperCase(),
                    style: Theme.of(
                      context,
                    ).textTheme.bodyMedium!.copyWith(fontSize: 9),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 3),
                  Text(
                    title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: Theme.of(
                      context,
                    ).textTheme.titleSmall!.copyWith(fontSize: 11),
                  ),
                  const SizedBox(height: 3),
                  priceAfetDiscount != null
                      ? Row(
                        children: [
                          Flexible(
                            child: Text(
                              "$priceAfetDiscount Birr",
                              style: const TextStyle(
                                color: Color(0xFF31B0D8),
                                fontWeight: FontWeight.w500,
                                fontSize: 11,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      )
                      : Text(
                        "$price Birr",
                        style: const TextStyle(
                          color: Color(0xFF31B0D8),
                          fontWeight: FontWeight.w500,
                          fontSize: 11,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
