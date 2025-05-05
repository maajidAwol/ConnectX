import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
// Removed NetworkImageWithLoader import as we'll handle loading/error states directly
// import 'package:korecha/components/network_image_with_loader.dart';

import '../../../../../constants.dart'; // Adjusted import path assuming constants.dart is at lib level

class ProfileCard extends StatelessWidget {
  const ProfileCard({
    super.key,
    required this.name,
    required this.email,
    required this.imageSrc, // Now this is the avatar_url
    this.proLableText = "Pro",
    this.isPro = false,
    this.press,
    this.isShowHi = true,
    this.isShowArrow = true,
  });

  final String name, email, imageSrc;
  final String proLableText;
  final bool isPro, isShowHi, isShowArrow;
  final VoidCallback? press;

  // Helper to get initials
  String getInitials(String name) =>
      name.isNotEmpty
          ? name.trim().split(' ').map((l) => l[0]).take(2).join().toUpperCase()
          : '';

  @override
  Widget build(BuildContext context) {
    final initials = getInitials(name);
    final hasImage = imageSrc.isNotEmpty;

    return ListTile(
      onTap: press,
      leading: CircleAvatar(
        radius: 28,
        backgroundColor:
            hasImage
                ? Colors.transparent
                : Theme.of(
                  context,
                ).primaryColor.withOpacity(0.1), // Background for initials
        // Use NetworkImage if imageSrc is valid, otherwise show initials
        backgroundImage: hasImage ? NetworkImage(imageSrc) : null,
        child:
            !hasImage && initials.isNotEmpty
                ? Text(
                  initials,
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).primaryColor,
                  ),
                )
                : null, // No child if image is loading or initials are empty
      ),
      title: Row(
        children: [
          Text(
            isShowHi ? "Hi, $name" : name,
            style: const TextStyle(fontWeight: FontWeight.w500),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(width: defaultPadding / 2),
          if (isPro)
            Container(
              padding: const EdgeInsets.symmetric(
                horizontal: defaultPadding / 2,
                vertical: defaultPadding / 4,
              ),
              decoration: const BoxDecoration(
                color: primaryColor,
                borderRadius: BorderRadius.all(
                  Radius.circular(defaultBorderRadious),
                ),
              ),
              child: Text(
                proLableText,
                style: const TextStyle(
                  fontFamily: grandisExtendedFont,
                  fontSize: 10,
                  fontWeight: FontWeight.w500,
                  color: Colors.white,
                  letterSpacing: 0.7,
                  height: 1,
                ),
              ),
            ),
        ],
      ),
      subtitle: Text(email),
      trailing:
          isShowArrow
              ? SvgPicture.asset(
                "assets/icons/miniRight.svg",
                colorFilter: ColorFilter.mode(
                  Theme.of(context).iconTheme.color!.withAlpha(102),
                  BlendMode.srcIn,
                ),
              )
              : null,
    );
  }
}
