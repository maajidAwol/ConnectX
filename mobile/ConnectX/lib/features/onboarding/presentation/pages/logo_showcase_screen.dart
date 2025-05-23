import 'package:flutter/material.dart';
import 'package:korecha/components/animated_logo.dart';
import 'package:korecha/constants.dart';

class LogoShowcaseScreen extends StatefulWidget {
  const LogoShowcaseScreen({super.key});

  @override
  State<LogoShowcaseScreen> createState() => _LogoShowcaseScreenState();
}

class _LogoShowcaseScreenState extends State<LogoShowcaseScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('ConnectX Logo Showcase'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(defaultPadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Title
            Text(
              'ConnectX Animated Logos',
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                fontWeight: FontWeight.bold,
                color: primaryColor,
              ),
              textAlign: TextAlign.center,
            ),

            const SizedBox(height: defaultPadding * 2),

            // Main Animated Logo
            _buildShowcaseCard(
              title: 'Main Animated Logo',
              description:
                  'Complete animation with scale, fade, bounce, and shimmer effects',
              child: const AnimatedConnectXLogo(
                width: 120,
                height: 120,
                autoStart: true,
              ),
            ),

            const SizedBox(height: defaultPadding * 2),

            // Pulsing Logo
            _buildShowcaseCard(
              title: 'Pulsing Logo',
              description: 'Gentle pulsing animation with glow effect',
              child: const PulsingConnectXLogo(
                width: 120,
                height: 120,
                glowColor: primaryColor,
              ),
            ),

            const SizedBox(height: defaultPadding * 2),

            // Floating Logo
            _buildShowcaseCard(
              title: 'Floating Logo',
              description: 'Subtle floating movement animation',
              child: const FloatingConnectXLogo(width: 120, height: 120),
            ),

            const SizedBox(height: defaultPadding * 2),

            // Different Sizes Demo
            _buildShowcaseCard(
              title: 'Size Variations',
              description: 'Different logo sizes for various UI components',
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  Column(
                    children: [
                      const PulsingConnectXLogo(width: 40, height: 40),
                      const SizedBox(height: 8),
                      Text(
                        'Small',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                  Column(
                    children: [
                      const PulsingConnectXLogo(width: 60, height: 60),
                      const SizedBox(height: 8),
                      Text(
                        'Medium',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                  Column(
                    children: [
                      const PulsingConnectXLogo(width: 80, height: 80),
                      const SizedBox(height: 8),
                      Text(
                        'Large',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: defaultPadding * 2),

            // Static Logo for Reference
            _buildShowcaseCard(
              title: 'Static Reference',
              description: 'Original ConnectX logo without animation',
              child: Image.asset(
                'assets/connectx/transparent_logo.png',
                width: 120,
                height: 120,
                fit: BoxFit.contain,
              ),
            ),

            const SizedBox(height: defaultPadding * 3),

            // Action Buttons
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      setState(() {}); // Restart animations
                    },
                    icon: const Icon(Icons.refresh),
                    label: const Text('Restart Animations'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: primaryColor,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(
                        vertical: defaultPadding,
                      ),
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: defaultPadding),

            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {
                      Navigator.pop(context);
                    },
                    icon: const Icon(Icons.arrow_back),
                    label: const Text('Back to App'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: primaryColor,
                      side: const BorderSide(color: primaryColor),
                      padding: const EdgeInsets.symmetric(
                        vertical: defaultPadding,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildShowcaseCard({
    required String title,
    required String description,
    required Widget child,
  }) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(defaultBorderRadious),
      ),
      child: Padding(
        padding: const EdgeInsets.all(defaultPadding * 1.5),
        child: Column(
          children: [
            Text(
              title,
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
                color: primaryColor,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: defaultPadding / 2),
            Text(
              description,
              style: Theme.of(
                context,
              ).textTheme.bodyMedium?.copyWith(color: Colors.grey[600]),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: defaultPadding * 1.5),
            Container(
              height: 150,
              decoration: BoxDecoration(
                color: Colors.grey[50],
                borderRadius: BorderRadius.circular(defaultBorderRadious / 2),
                border: Border.all(color: Colors.grey[200]!),
              ),
              child: Center(child: child),
            ),
          ],
        ),
      ),
    );
  }
}
