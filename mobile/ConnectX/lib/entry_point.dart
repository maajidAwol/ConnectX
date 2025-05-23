import 'package:animations/animations.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:korecha/constants.dart';
import 'package:korecha/features/authentication/presentation/state/auth/bloc/auth_bloc.dart';
import 'package:korecha/features/authentication/presentation/state/profile/bloc/profile_bloc.dart';
import 'package:korecha/route/screen_export.dart';

class EntryPoint extends StatefulWidget {
  final int? initialIndex;
  const EntryPoint({super.key, this.initialIndex});

  @override
  State<EntryPoint> createState() => _EntryPointState();
}

class _EntryPointState extends State<EntryPoint> {
  final List _pages = const [
    HomeScreen(),
    DiscoverScreen(),
    // BookmarkScreen(),
    OrdersScreen(),
    // EmptyCartScreen(), // if Cart is empty
    CartScreen(),
    ProfilePage(),
  ];

  late int _currentIndex;

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex ?? 0;
    context.read<ProfileBloc>().add(LoadProfile());
  }

  // Helper to get initials (can be moved to a utils file)
  String getInitials(String name) =>
      name.isNotEmpty
          ? name.trim().split(' ').map((l) => l[0]).take(2).join().toUpperCase()
          : '';

  @override
  Widget build(BuildContext context) {
    // Get the arguments if passed through route
    final args = ModalRoute.of(context)?.settings.arguments;
    if (args != null && args is int && _currentIndex != args) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        setState(() {
          _currentIndex = args;
        });
      });
    }

    SvgPicture svgIcon(String src, {Color? color}) {
      return SvgPicture.asset(
        src,
        height: 24,
        colorFilter: ColorFilter.mode(
          color ??
              Theme.of(context).iconTheme.color!.withOpacity(
                Theme.of(context).brightness == Brightness.dark ? 0.3 : 1,
              ),
          BlendMode.srcIn,
        ),
      );
    }

    double height = MediaQuery.of(context).size.height;
    double width = MediaQuery.of(context).size.width;
    return BlocBuilder<ProfileBloc, ProfileState>(
      builder: (context, state) {
        // Determine avatar display based on profile state
        Widget avatarWidget = const CircleAvatar(
          radius: 14,
        ); // Default placeholder
        String userName = "User";
        String userEmail = "";
        String avatarUrl = "";

        if (state is ProfileLoaded) {
          userName = state.user.name;
          userEmail = state.user.email;
          avatarUrl = state.user.avatar_url ?? '';
          final initials = getInitials(userName);
          final hasImage = avatarUrl.isNotEmpty;

          avatarWidget = CircleAvatar(
            radius: 14,
            backgroundColor:
                hasImage
                    ? Colors.transparent
                    : Theme.of(context).primaryColor.withOpacity(0.1),
            backgroundImage: hasImage ? NetworkImage(avatarUrl) : null,
            child:
                !hasImage && initials.isNotEmpty
                    ? Text(
                      initials,
                      style: TextStyle(
                        fontSize: 12, // Smaller font for AppBar
                        fontWeight: FontWeight.bold,
                        color: Theme.of(context).primaryColor,
                      ),
                    )
                    : null,
          );
        }

        return Scaffold(
          appBar: AppBar(
            surfaceTintColor: Theme.of(context).scaffoldBackgroundColor,
            // pinned: true,
            // floating: true,
            // snap: true,
            backgroundColor: Theme.of(context).scaffoldBackgroundColor,
            leading: const SizedBox(),
            leadingWidth: 0,
            centerTitle: false,
            title: Image.asset(
              "assets/connectx/transparent_logo.png",

              // color: Theme.of(context).iconTheme.color,
              height: height * 0.05,
              width: width * 0.4,
            ),
            actions: [
              // IconButton(
              //   onPressed: () {
              //     Navigator.pushNamed(context, searchScreenRoute);
              //   },
              //   icon: SvgPicture.asset(
              //     "assets/icons/Search.svg",
              //     height: 24,
              //     colorFilter: ColorFilter.mode(
              //         Theme.of(context).textTheme.bodyLarge!.color!,
              //         BlendMode.srcIn),
              //   ),
              // ),
              // IconButton(
              //   onPressed: () {
              //     Navigator.pushNamed(context, notificationsScreenRoute);
              //   },
              //   icon: SvgPicture.asset(
              //     "assets/icons/Notification.svg",
              //     height: 24,
              //     colorFilter: ColorFilter.mode(
              //         Theme.of(context).textTheme.bodyLarge!.color!,
              //         BlendMode.srcIn),
              //   ),
              // ),
              PopupMenuButton<String>(
                shape: RoundedRectangleBorder(
                  side: BorderSide(color: Theme.of(context).primaryColor),
                  borderRadius: BorderRadius.circular(10),
                ),
                borderRadius: BorderRadius.circular(10),
                color: Theme.of(context).scaffoldBackgroundColor,

                offset: const Offset(0, 40), // Adjust offset if needed
                child: Padding(
                  padding: const EdgeInsets.only(
                    right: defaultPadding,
                    left: 8.0,
                  ), // Adjust padding
                  child: avatarWidget, // Use the determined avatar widget
                ),
                onSelected: (value) {
                  switch (value) {
                    case 'profile':
                      setState(() {
                        _currentIndex = 4;
                      });
                      break;
                    // case 'settings':
                    //   // Handle settings
                    //   break;
                    case 'logout':
                      context.read<AuthBloc>().add(LogoutRequested());
                      Navigator.pushNamed(context, logInScreenRoute);
                      break;
                  }
                },
                itemBuilder:
                    (BuildContext context) => <PopupMenuEntry<String>>[
                      // Conditionally show user info if loaded
                      if (state is ProfileLoaded)
                        PopupMenuItem<String>(
                          enabled: false,
                          child: Row(
                            children: [
                              // Use the same avatarWidget logic here for consistency
                              avatarWidget, // Display the same avatar
                              const SizedBox(width: 8),
                              Expanded(
                                // Use Expanded to prevent overflow
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(
                                      userName,
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                      ),
                                      overflow:
                                          TextOverflow
                                              .ellipsis, // Handle long names
                                    ),
                                    Text(
                                      userEmail,
                                      style: TextStyle(
                                        color:
                                            Theme.of(
                                              context,
                                            ).textTheme.bodySmall?.color,
                                        fontSize: 12,
                                      ),
                                      overflow:
                                          TextOverflow
                                              .ellipsis, // Handle long emails
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      if (state is ProfileLoaded) const PopupMenuDivider(),
                      const PopupMenuItem<String>(
                        value: 'profile',
                        child: Row(
                          children: [
                            Icon(Icons.person_outline),
                            SizedBox(width: 8),
                            Text('Profile'),
                          ],
                        ),
                      ),
                      // const PopupMenuItem<String>(
                      //   value: 'settings',
                      //   child: Row(
                      //     children: [
                      //       Icon(Icons.settings_outlined),
                      //       SizedBox(width: 8),
                      //       Text('Settings'),
                      //     ],
                      //   ),
                      // ),
                      // const PopupMenuDivider(),
                      const PopupMenuItem<String>(
                        value: 'logout',
                        child: Row(
                          children: [
                            Icon(Icons.logout, color: Colors.red),
                            SizedBox(width: 8),
                            Text('Logout', style: TextStyle(color: Colors.red)),
                          ],
                        ),
                      ),
                    ],
              ),
            ],
          ),
          // body: _pages[_currentIndex],
          body: PageTransitionSwitcher(
            duration: defaultDuration,
            transitionBuilder: (child, animation, secondAnimation) {
              return FadeThroughTransition(
                animation: animation,
                secondaryAnimation: secondAnimation,
                child: child,
              );
            },
            child: _pages[_currentIndex],
          ),
          bottomNavigationBar: Container(
            padding: const EdgeInsets.only(top: defaultPadding / 2),
            color:
                Theme.of(context).brightness == Brightness.light
                    ? Colors.white
                    : const Color(0xFF101015),
            child: BottomNavigationBar(
              currentIndex: _currentIndex,
              onTap: (index) {
                if (index != _currentIndex) {
                  setState(() {
                    _currentIndex = index;
                  });
                }
              },
              backgroundColor:
                  Theme.of(context).brightness == Brightness.light
                      ? Colors.white
                      : const Color(0xFF101015),
              type: BottomNavigationBarType.fixed,
              // selectedLabelStyle: TextStyle(color: primaryColor),
              selectedFontSize: 12,
              selectedItemColor: primaryColor,
              unselectedItemColor: Colors.transparent,
              items: [
                BottomNavigationBarItem(
                  icon: svgIcon("assets/icons/Shop.svg"),
                  activeIcon: svgIcon(
                    "assets/icons/Shop.svg",
                    color: primaryColor,
                  ),
                  label: "Shop",
                ),
                BottomNavigationBarItem(
                  icon: svgIcon("assets/icons/Category.svg"),
                  activeIcon: svgIcon(
                    "assets/icons/Category.svg",
                    color: primaryColor,
                  ),
                  label: "Discover",
                ),
                BottomNavigationBarItem(
                  icon: svgIcon("assets/icons/Order.svg"),
                  activeIcon: svgIcon(
                    "assets/icons/Order.svg",
                    color: primaryColor,
                  ),
                  label: "Orders",
                ),
                BottomNavigationBarItem(
                  icon: svgIcon("assets/icons/Bag.svg"),
                  activeIcon: svgIcon(
                    "assets/icons/Bag.svg",
                    color: primaryColor,
                  ),
                  label: "Cart",
                ),
                BottomNavigationBarItem(
                  icon: svgIcon("assets/icons/Profile.svg"),
                  activeIcon: svgIcon(
                    "assets/icons/Profile.svg",
                    color: primaryColor,
                  ),
                  label: "Profile",
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
