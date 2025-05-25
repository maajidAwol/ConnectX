import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/svg.dart';
import 'package:korecha/constants.dart';
import 'package:korecha/features/authentication/presentation/state/auth/bloc/auth_bloc.dart';
import 'package:korecha/features/authentication/presentation/state/profile/bloc/profile_bloc.dart';
import 'package:korecha/features/authentication/presentation/widgets/profile/profile_card.dart';
import 'package:korecha/features/authentication/presentation/widgets/profile/profile_menu_item_list_tile.dart';
import 'package:korecha/route/screen_export.dart';
import 'package:korecha/features/authentication/presentation/widgets/profile/profile_shimmer.dart';
import 'package:url_launcher/url_launcher.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  @override
  void initState() {
    super.initState();
    context.read<ProfileBloc>().add(LoadProfile());
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ProfileBloc, ProfileState>(
      builder: (context, state) {
        if (state is ProfileLoading) {
          return const ProfileShimmer();
        }
        if (state is ProfileError) {
          return Center(child: Text(state.message));
        }
        if (state is ProfileLoaded) {
          return Scaffold(
            body: ListView(
              children: [
                ProfileCard(
                  name: state.user.name,
                  email: state.user.email,
                  imageSrc: state.user.avatar_url ?? '',
                  // proLableText: "Sliver",
                  // isPro: true, if the user is pro
                  press: () {
                    Navigator.pushNamed(context, profileUpdateScreenRoute);
                  },
                ),

                // Padding(
                //   padding: const EdgeInsets.symmetric(
                //       horizontal: defaultPadding, vertical: defaultPadding * 1.5),
                //   child: GestureDetector(
                //     onTap: () {},
                //     child: const AspectRatio(
                //       aspectRatio: 1.8,
                //       child:
                //           NetworkImageWithLoader("https://i.imgur.com/dz0BBom.png"),
                //     ),
                //   ),
                // ),
                Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: defaultPadding,
                  ),
                  child: Text(
                    "Account",
                    style: Theme.of(context).textTheme.titleSmall,
                  ),
                ),
                const SizedBox(height: defaultPadding / 2),
                ProfileMenuListTile(
                  text: "Edit Profile",
                  svgSrc: "assets/icons/Edit Square.svg",
                  press: () {
                    Navigator.pushNamed(context, profileUpdateScreenRoute);
                  },
                ),
                ProfileMenuListTile(
                  text: "Cart",
                  svgSrc: "assets/icons/Order.svg",
                  press: () {
                    // Navigator.pushNamed(context, cartScreenRoute);
                    Navigator.pushNamedAndRemoveUntil(
                      context,
                      entryPointScreenRoute,
                      (route) => false,
                      arguments: 3,
                    );
                  },
                ),
                ProfileMenuListTile(
                  text: "Orders",
                  svgSrc: "assets/icons/Order.svg",
                  press: () {
                    // Navigator.pushNamed(context, ordersScreenRoute);
                    Navigator.pushNamedAndRemoveUntil(
                      context,
                      entryPointScreenRoute,
                      (route) => false,
                      arguments: 2,
                    );
                  },
                ),
                // ProfileMenuListTile(
                //   text: "Returns",
                //   svgSrc: "assets/icons/Return.svg",
                //   press: () {},
                // ),
                // ProfileMenuListTile(
                //   text: "Wishlist",
                //   svgSrc: "assets/icons/Wishlist.svg",
                //   press: () {},
                // ),
                ProfileMenuListTile(
                  text: "Addresses",
                  svgSrc: "assets/icons/Address.svg",
                  press: () {
                    Navigator.pushNamed(context, addAddressScreenRoute);
                  },
                ),
                // ProfileMenuListTile(
                //   text: "Payment",
                //   svgSrc: "assets/icons/card.svg",
                //   press: () {
                //     Navigator.pushNamed(context, emptyPaymentScreenRoute);
                //   },
                // ),
                // ProfileMenuListTile(
                //   text: "Wallet",
                //   svgSrc: "assets/icons/Wallet.svg",
                //   press: () {
                //     Navigator.pushNamed(context, walletScreenRoute);
                //   },
                // ),
                // const SizedBox(height: defaultPadding),
                // Padding(
                //   padding: const EdgeInsets.symmetric(
                //       horizontal: defaultPadding, vertical: defaultPadding / 2),
                //   child: Text(
                //     "Personalization",
                //     style: Theme.of(context).textTheme.titleSmall,
                //   ),
                // ),
                // DividerListTileWithTrilingText(
                //   svgSrc: "assets/icons/Notification.svg",
                //   title: "Notification",
                //   trilingText: "Off",
                //   press: () {
                //     Navigator.pushNamed(context, enableNotificationScreenRoute);
                //   },
                // ),
                // ProfileMenuListTile(
                //   text: "Preferences",
                //   svgSrc: "assets/icons/Preferences.svg",
                //   press: () {
                //     Navigator.pushNamed(context, preferencesScreenRoute);
                //   },
                // ),
                // const SizedBox(height: defaultPadding),
                // Padding(
                //   padding: const EdgeInsets.symmetric(
                //       horizontal: defaultPadding, vertical: defaultPadding / 2),
                //   child: Text(
                //     "Settings",
                //     style: Theme.of(context).textTheme.titleSmall,
                //   ),
                // ),
                // ProfileMenuListTile(
                //   text: "Language",
                //   svgSrc: "assets/icons/Language.svg",
                //   press: () {
                //     Navigator.pushNamed(context, selectLanguageScreenRoute);
                //   },
                // ),
                // ProfileMenuListTile(
                //   text: "Location",
                //   svgSrc: "assets/icons/Location.svg",
                //   press: () {},
                // ),
                // const SizedBox(height: defaultPadding),
                Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: defaultPadding,
                    vertical: defaultPadding / 2,
                  ),
                  child: Text(
                    "Help & Support",
                    style: Theme.of(context).textTheme.titleSmall,
                  ),
                ),
                // ProfileMenuListTile(
                //   text: "Get Help",
                //   svgSrc: "assets/icons/Help.svg",
                //   press: () {
                //     Navigator.pushNamed(context, getHelpScreenRoute);
                //   },
                // ),
                ProfileMenuListTile(
                  text: "FAQ",
                  svgSrc: "assets/icons/FAQ.svg",
                  press: () {
                    launchUrl(Uri.parse("https://connect-x-peach.vercel.app/"));
                  },
                  isShowDivider: true,
                ),
                const SizedBox(height: defaultPadding),

                // Log Out
                ListTile(
                  horizontalTitleGap: 10,
                  onTap: () {
                    context.read<AuthBloc>().add(LogoutRequested());

                    Navigator.pushNamedAndRemoveUntil(
                      context,
                      logInScreenRoute,
                      (route) => false,
                    );
                  },
                  // minLeadingWidth: 24,
                  leading: SvgPicture.asset(
                    "assets/icons/Logout.svg",
                    height: 24,
                    width: 24,
                    colorFilter: const ColorFilter.mode(
                      errorColor,
                      BlendMode.srcIn,
                    ),
                  ),
                  title: const Text(
                    "Log Out",
                    style: TextStyle(
                      color: errorColor,
                      fontSize: 14,
                      height: 1,
                    ),
                  ),
                ),
              ],
            ),
          );
        } else {
          return const SizedBox.shrink();
        }
      },
    );
  }
}
