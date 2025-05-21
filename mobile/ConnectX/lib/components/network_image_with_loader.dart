import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

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
    if (url == "icon-url") return false;
    if (url.startsWith('file:///')) return false;
    if (url.contains('example.com')) return false;

    try {
      final uri = Uri.parse(url);
      return uri.hasScheme && (uri.scheme == 'http' || uri.scheme == 'https');
    } catch (e) {
      return false;
    }
  }

  @override
  Widget build(BuildContext context) {
    // Check if the URL is valid before trying to load it
    if (!_isValidUrl(src)) {
      return ClipRRect(
        borderRadius: BorderRadius.all(Radius.circular(radius)),
        child: Container(
          color: Colors.grey[200],
          child: Center(
            child: Icon(
              Icons.image_not_supported_outlined,
              color: Colors.grey[400],
            ),
          ),
        ),
      );
    }

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
        errorWidget:
            (context, url, error) => Container(
              color: Colors.grey[200],
              child: Center(
                child: Icon(
                  Icons.broken_image_outlined,
                  color: Colors.grey[400],
                ),
              ),
            ),
      ),
    );
  }
}
