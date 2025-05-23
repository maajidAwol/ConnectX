import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:korecha/components/animated_logo.dart';
import 'package:korecha/route/screen_export.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _backgroundController;
  late Animation<Color?> _backgroundAnimation;

  @override
  void initState() {
    super.initState();
    _initializeBackgroundAnimation();

    // Set system UI overlay style
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersive);
  }

  void _initializeBackgroundAnimation() {
    _backgroundController = AnimationController(
      duration: const Duration(milliseconds: 3000),
      vsync: this,
    );

    _backgroundAnimation = ColorTween(
      begin: const Color(0xFF1E3A8A), // Deep blue
      end: const Color(0xFF059669), // Green
    ).animate(
      CurvedAnimation(parent: _backgroundController, curve: Curves.easeInOut),
    );

    _backgroundController.forward();
  }

  void _navigateToNextScreen() {
    // Restore system UI overlay style
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);

    // Navigate to the main app
    Navigator.pushReplacementNamed(context, entryPointScreenRoute);
  }

  @override
  void dispose() {
    _backgroundController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: AnimatedBuilder(
        animation: _backgroundAnimation,
        builder: (context, child) {
          return Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  _backgroundAnimation.value ?? const Color(0xFF1E3A8A),
                  _backgroundAnimation.value?.withOpacity(0.8) ??
                      const Color(0xFF1E3A8A).withOpacity(0.8),
                  const Color(0xFF059669),
                ],
              ),
            ),
            child: SafeArea(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Animated logo
                  AnimatedConnectXLogo(
                    width: 200,
                    height: 200,
                    animationDuration: const Duration(milliseconds: 2500),
                    onAnimationComplete: () {
                      // Delay a bit more then navigate
                      Future.delayed(const Duration(milliseconds: 1000), () {
                        if (mounted) {
                          _navigateToNextScreen();
                        }
                      });
                    },
                  ),

                  const SizedBox(height: 40),

                  // App name with fade animation
                  TweenAnimationBuilder<double>(
                    duration: const Duration(milliseconds: 1500),
                    tween: Tween<double>(begin: 0.0, end: 1.0),
                    builder: (context, value, child) {
                      return Opacity(
                        opacity: value,
                        child: Transform.translate(
                          offset: Offset(0, 20 * (1 - value)),
                          child: Column(
                            children: [
                              Text(
                                'ConnectX',
                                style: TextStyle(
                                  fontSize: 32,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                  letterSpacing: 2,
                                  shadows: [
                                    Shadow(
                                      color: Colors.black.withOpacity(0.3),
                                      offset: const Offset(0, 2),
                                      blurRadius: 8,
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Connect • Shop • Deliver',
                                style: TextStyle(
                                  fontSize: 16,
                                  color: Colors.white.withOpacity(0.9),
                                  letterSpacing: 1,
                                  fontWeight: FontWeight.w300,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),

                  const SizedBox(height: 60),

                  // Loading indicator
                  TweenAnimationBuilder<double>(
                    duration: const Duration(milliseconds: 2000),
                    tween: Tween<double>(begin: 0.0, end: 1.0),
                    builder: (context, value, child) {
                      return Opacity(
                        opacity: value,
                        child: Column(
                          children: [
                            Container(
                              width: 200,
                              height: 4,
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.3),
                                borderRadius: BorderRadius.circular(2),
                              ),
                              child: Align(
                                alignment: Alignment.centerLeft,
                                child: AnimatedContainer(
                                  duration: Duration(
                                    milliseconds: 100 + (value * 2000).toInt(),
                                  ),
                                  width: 200 * value,
                                  height: 4,
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(2),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.white.withOpacity(0.5),
                                        blurRadius: 8,
                                        spreadRadius: 1,
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(height: 16),
                            Text(
                              'Loading...',
                              style: TextStyle(
                                color: Colors.white.withOpacity(0.8),
                                fontSize: 14,
                                fontWeight: FontWeight.w300,
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
          );
        },
      ),
    );
  }
}

// Alternative minimal splash screen
class MinimalSplashScreen extends StatefulWidget {
  const MinimalSplashScreen({super.key});

  @override
  State<MinimalSplashScreen> createState() => _MinimalSplashScreenState();
}

class _MinimalSplashScreenState extends State<MinimalSplashScreen> {
  @override
  void initState() {
    super.initState();

    // Auto navigate after animation
    Future.delayed(const Duration(milliseconds: 3000), () {
      if (mounted) {
        Navigator.pushReplacementNamed(context, entryPointScreenRoute);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Pulsing logo for minimal version
            PulsingConnectXLogo(
              width: 150,
              height: 150,
              glowColor: const Color(0xFF059669),
            ),

            const SizedBox(height: 40),

            TweenAnimationBuilder<double>(
              duration: const Duration(milliseconds: 1500),
              tween: Tween<double>(begin: 0.0, end: 1.0),
              builder: (context, value, child) {
                return Opacity(
                  opacity: value,
                  child: Text(
                    'ConnectX',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: const Color(0xFF1E3A8A),
                      letterSpacing: 1.5,
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
