import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'dart:io';

import '../constants.dart';
import 'skleton/skelton.dart';

class NetworkImageWithLoader extends StatelessWidget {
  final BoxFit fit;

  const NetworkImageWithLoader(
    this.src, {
    super.key,
    this.fit = BoxFit.cover,
    this.radius = defaultPadding,
  });

  final String src;
  final double radius;

  bool _isValidUrl(String url) {
    // Check if the URL is valid and has a proper scheme
    if (url.isEmpty) return false;

    // Check for problematic URLs
    if (url == "icon-url") return false;
    if (url.contains("icon-url")) return false;
    if (url.startsWith('file:///')) return false;
    if (url.contains('example.com')) return false;

    // Remove the problematic filtering of t4.ftcdn.net - it's a valid image host
    // if (url.contains('t4.ftcdn.net')) return false;

    try {
      final uri = Uri.parse(url);
      return uri.hasScheme && (uri.scheme == 'http' || uri.scheme == 'https');
    } catch (e) {
      return false;
    }
  }

  Widget _buildPlaceholder() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.grey[200],
        borderRadius: BorderRadius.all(Radius.circular(radius)),
      ),
      child: Center(
        child: Icon(Icons.category_outlined, color: Colors.grey[400], size: 20),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    // Return placeholder for invalid URLs
    if (!_isValidUrl(src)) {
      return _buildPlaceholder();
    }

    // Wrap in try-catch to handle any potential exceptions
    try {
      return ClipRRect(
        borderRadius: BorderRadius.all(Radius.circular(radius)),
        child: CachedNetworkImage(
          fit: fit,
          imageUrl: src,
          imageBuilder:
              (context, imageProvider) => Container(
                decoration: BoxDecoration(
                  image: DecorationImage(image: imageProvider, fit: fit),
                ),
              ),
          placeholder: (context, url) => const Skeleton(),
          errorWidget: (context, url, error) {
            debugPrint("Failed to load image: $url, Error: $error");
            return _buildPlaceholder();
          },
        ),
      );
    } catch (e) {
      // If any exception occurs, return the placeholder
      debugPrint("Image loading error: $e for URL: $src");
      return _buildPlaceholder();
    }
  }
}
