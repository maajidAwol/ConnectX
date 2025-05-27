import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:korecha/components/dot_indicators.dart';
import 'package:korecha/constants.dart';
import 'package:korecha/route/route_constants.dart';
import 'package:korecha/core/services/storage_service.dart';
import 'package:korecha/core/injection/injection_container.dart' as di;

import 'package:korecha/features/onboarding/presentation/widgets/onbording_content.dart';

class OnBordingScreen extends StatefulWidget {
  const OnBordingScreen({super.key});

  @override
  State<OnBordingScreen> createState() => _OnBordingScreenState();
}

class _OnBordingScreenState extends State<OnBordingScreen> {
  late PageController _pageController;
  int _pageIndex = 0;
  final List<Onbord> _onbordData = [
    Onbord(
      image: "assets/Illustration/Illustration-0.png",
      imageDarkTheme: "assets/Illustration/Illustration_darkTheme_0.png",
      title: "Welcome to \nConnectX",
      description:
          "Discover amazing products from local sellers and connect with your community through our marketplace.",
    ),
    Onbord(
      image: "assets/Illustration/Illustration-1.png",
      imageDarkTheme: "assets/Illustration/Illustration_darkTheme_1.png",
      title: "Shop with \nconfidence",
      description:
          "Browse through carefully curated products, add items to your cart, and save favorites to your wishlist for later.",
    ),
    Onbord(
      image: "assets/Illustration/Illustration-2.png",
      imageDarkTheme: "assets/Illustration/Illustration_darkTheme_2.png",
      title: "Secure & easy \npayments",
      description:
          "Multiple payment options ensure safe and convenient transactions for all your purchases.",
    ),
    Onbord(
      image: "assets/Illustration/Illustration-4.png",
      imageDarkTheme: "assets/Illustration/Illustration_darkTheme_4.png",
      title: "Connect with \nlocal sellers",
      description:
          "Discover nearby stores, explore their unique products, and support your local community through ConnectX.",
    ),
  ];

  @override
  void initState() {
    _pageController = PageController(initialPage: 0);
    super.initState();
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: defaultPadding),
          child: Column(
            children: [
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: () {
                    di.sl<StorageService>().setHasSeenOnboarding();
                    Navigator.pushReplacementNamed(context, logInScreenRoute);
                  },
                  child: Text(
                    "Skip",
                    style: TextStyle(
                      color: Theme.of(context).textTheme.bodyLarge!.color,
                    ),
                  ),
                ),
              ),
              Expanded(
                child: PageView.builder(
                  controller: _pageController,
                  itemCount: _onbordData.length,
                  onPageChanged: (value) {
                    setState(() {
                      _pageIndex = value;
                    });
                  },
                  itemBuilder:
                      (context, index) => OnbordingContent(
                        title: _onbordData[index].title,
                        description: _onbordData[index].description,
                        image:
                            (Theme.of(context).brightness == Brightness.dark &&
                                    _onbordData[index].imageDarkTheme != null)
                                ? _onbordData[index].imageDarkTheme!
                                : _onbordData[index].image,
                        isTextOnTop: index.isOdd,
                      ),
                ),
              ),
              Row(
                children: [
                  ...List.generate(
                    _onbordData.length,
                    (index) => Padding(
                      padding: const EdgeInsets.only(right: defaultPadding / 4),
                      child: DotIndicator(isActive: index == _pageIndex),
                    ),
                  ),
                  const Spacer(),
                  SizedBox(
                    height: 60,
                    width: 60,
                    child: ElevatedButton(
                      onPressed: () {
                        if (_pageIndex < _onbordData.length - 1) {
                          _pageController.nextPage(
                            curve: Curves.ease,
                            duration: defaultDuration,
                          );
                        } else {
                          di.sl<StorageService>().setHasSeenOnboarding();
                          Navigator.pushReplacementNamed(
                            context,
                            logInScreenRoute,
                          );
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        shape: const CircleBorder(),
                      ),
                      child: SvgPicture.asset(
                        "assets/icons/Arrow - Right.svg",
                        colorFilter: const ColorFilter.mode(
                          Colors.white,
                          BlendMode.srcIn,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: defaultPadding),
            ],
          ),
        ),
      ),
    );
  }
}

class Onbord {
  final String image, title, description;
  final String? imageDarkTheme;

  Onbord({
    required this.image,
    required this.title,
    this.description = "",
    this.imageDarkTheme,
  });
}
