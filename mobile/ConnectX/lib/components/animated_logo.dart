import 'package:flutter/material.dart';

class AnimatedConnectXLogo extends StatefulWidget {
  final double? width;
  final double? height;
  final Duration animationDuration;
  final bool autoStart;
  final VoidCallback? onAnimationComplete;

  const AnimatedConnectXLogo({
    super.key,
    this.width,
    this.height,
    this.animationDuration = const Duration(milliseconds: 2000),
    this.autoStart = true,
    this.onAnimationComplete,
  });

  @override
  State<AnimatedConnectXLogo> createState() => _AnimatedConnectXLogoState();
}

class _AnimatedConnectXLogoState extends State<AnimatedConnectXLogo>
    with TickerProviderStateMixin {
  late AnimationController _scaleController;
  late AnimationController _fadeController;
  late AnimationController _bounceController;
  late AnimationController _shimmerController;

  late Animation<double> _scaleAnimation;
  late Animation<double> _fadeAnimation;
  late Animation<double> _bounceAnimation;
  late Animation<double> _shimmerAnimation;

  @override
  void initState() {
    super.initState();
    _initializeAnimations();
    if (widget.autoStart) {
      _startAnimation();
    }
  }

  void _initializeAnimations() {
    // Scale animation controller
    _scaleController = AnimationController(
      duration: Duration(
        milliseconds: widget.animationDuration.inMilliseconds ~/ 2,
      ),
      vsync: this,
    );

    // Fade animation controller
    _fadeController = AnimationController(
      duration: Duration(
        milliseconds: widget.animationDuration.inMilliseconds ~/ 3,
      ),
      vsync: this,
    );

    // Bounce animation controller
    _bounceController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );

    // Shimmer animation controller
    _shimmerController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );

    // Scale animation with elastic curve
    _scaleAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _scaleController, curve: Curves.elasticOut),
    );

    // Fade animation
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _fadeController, curve: Curves.easeInOut),
    );

    // Bounce animation
    _bounceAnimation = Tween<double>(begin: 1.0, end: 1.1).animate(
      CurvedAnimation(parent: _bounceController, curve: Curves.bounceInOut),
    );

    // Shimmer animation
    _shimmerAnimation = Tween<double>(begin: -2.0, end: 2.0).animate(
      CurvedAnimation(parent: _shimmerController, curve: Curves.easeInOut),
    );
  }

  Future<void> _startAnimation() async {
    // Start fade and scale animations simultaneously
    _fadeController.forward();
    await _scaleController.forward();

    // Add a small bounce effect
    await _bounceController.forward();
    await _bounceController.reverse();

    // Add shimmer effect
    await _shimmerController.forward();

    // Callback when animation completes
    widget.onAnimationComplete?.call();
  }

  @override
  void dispose() {
    _scaleController.dispose();
    _fadeController.dispose();
    _bounceController.dispose();
    _shimmerController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: Listenable.merge([
        _scaleAnimation,
        _fadeAnimation,
        _bounceAnimation,
        _shimmerAnimation,
      ]),
      builder: (context, child) {
        return Transform.scale(
          scale: _scaleAnimation.value * _bounceAnimation.value,
          child: Opacity(
            opacity: _fadeAnimation.value,
            child: Container(
              width: widget.width,
              height: widget.height,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 20,
                    offset: const Offset(0, 10),
                  ),
                ],
              ),
              child: Stack(
                children: [
                  // Main logo
                  Center(
                    child: Image.asset(
                      'assets/connectx/transparent_logo.png',
                      width: widget.width,
                      height: widget.height,
                      fit: BoxFit.contain,
                    ),
                  ),
                  // Shimmer effect overlay
                  if (_shimmerController.isAnimating)
                    ClipRect(
                      child: Opacity(
                        opacity: 0.3,
                        child: Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                              colors: const [
                                Colors.transparent,
                                Colors.white,
                                Colors.transparent,
                              ],
                              stops: const [0.0, 0.5, 1.0],
                              transform: GradientRotation(
                                _shimmerAnimation.value,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}

// Alternative logo with pulse effect
class PulsingConnectXLogo extends StatefulWidget {
  final double? width;
  final double? height;
  final Color? glowColor;

  const PulsingConnectXLogo({
    super.key,
    this.width,
    this.height,
    this.glowColor,
  });

  @override
  State<PulsingConnectXLogo> createState() => _PulsingConnectXLogoState();
}

class _PulsingConnectXLogoState extends State<PulsingConnectXLogo>
    with SingleTickerProviderStateMixin {
  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );

    _pulseAnimation = Tween<double>(begin: 0.8, end: 1.2).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );

    _pulseController.repeat(reverse: true);
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _pulseAnimation,
      builder: (context, child) {
        return Container(
          width: widget.width,
          height: widget.height,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: (widget.glowColor ?? Theme.of(context).primaryColor)
                    .withOpacity(0.3 * _pulseAnimation.value),
                blurRadius: 20 * _pulseAnimation.value,
                spreadRadius: 5 * _pulseAnimation.value,
              ),
            ],
          ),
          child: Transform.scale(
            scale: _pulseAnimation.value,
            child: Image.asset(
              'assets/connectx/transparent_logo.png',
              width: widget.width,
              height: widget.height,
              fit: BoxFit.contain,
            ),
          ),
        );
      },
    );
  }
}

// Floating logo with subtle movement
class FloatingConnectXLogo extends StatefulWidget {
  final double? width;
  final double? height;

  const FloatingConnectXLogo({super.key, this.width, this.height});

  @override
  State<FloatingConnectXLogo> createState() => _FloatingConnectXLogoState();
}

class _FloatingConnectXLogoState extends State<FloatingConnectXLogo>
    with SingleTickerProviderStateMixin {
  late AnimationController _floatController;
  late Animation<double> _floatAnimation;

  @override
  void initState() {
    super.initState();
    _floatController = AnimationController(
      duration: const Duration(milliseconds: 3000),
      vsync: this,
    );

    _floatAnimation = Tween<double>(begin: -10.0, end: 10.0).animate(
      CurvedAnimation(parent: _floatController, curve: Curves.easeInOut),
    );

    _floatController.repeat(reverse: true);
  }

  @override
  void dispose() {
    _floatController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _floatAnimation,
      builder: (context, child) {
        return Transform.translate(
          offset: Offset(0, _floatAnimation.value),
          child: Image.asset(
            'assets/connectx/transparent_logo.png',
            width: widget.width,
            height: widget.height,
            fit: BoxFit.contain,
          ),
        );
      },
    );
  }
}
