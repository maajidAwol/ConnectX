import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '../../../../../constants.dart';

class SignUpForm extends StatelessWidget {
  const SignUpForm({
    super.key,
    required this.formKey,
    required this.nameController,
    required this.emailController,
    required this.passwordController,
    required this.confirmPasswordController,
    required this.ageController,
    required this.genderController,
  });

  final GlobalKey<FormState> formKey;
  final TextEditingController nameController;
  final TextEditingController emailController;
  final TextEditingController passwordController;
  final TextEditingController confirmPasswordController;
  final TextEditingController ageController;
  final TextEditingController genderController;

  @override
  Widget build(BuildContext context) {
    String? passwordValidator(String? value) {
      if (value == null || value.isEmpty) return 'Password is required';
      if (value.length < 6) return 'Password must be at least 6 characters';
      return null;
    }

    return Form(
      key: formKey,
      child: Column(
        children: [
          TextFormField(
            controller: nameController,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Name is required';
              }
              return null;
            },
            decoration: const InputDecoration(
              hintText: "Full Name",
              prefixIcon: Icon(Icons.person_outline),
            ),
          ),
          const SizedBox(height: defaultPadding),
          TextFormField(
            controller: emailController,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Email is required';
              }
              if (!RegExp(
                r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+",
              ).hasMatch(value)) {
                return 'Please enter a valid email address';
              }
              return null;
            },
            keyboardType: TextInputType.emailAddress,
            decoration: InputDecoration(
              hintText: "Email",
              prefixIcon: Padding(
                padding: const EdgeInsets.all(defaultPadding * 0.75),
                child: SvgPicture.asset(
                  "assets/icons/Message.svg",
                  height: 24,
                  width: 24,
                  colorFilter: ColorFilter.mode(
                    Theme.of(
                      context,
                    ).textTheme.bodyLarge!.color!.withOpacity(0.3),
                    BlendMode.srcIn,
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: defaultPadding),
          Row(
            children: [
              Expanded(
                child: TextFormField(
                  controller: ageController,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Age is required';
                    }
                    final age = int.tryParse(value);
                    if (age == null || age < 1 || age > 120) {
                      return 'Please enter a valid age (1-120)';
                    }
                    return null;
                  },
                  keyboardType: TextInputType.number,
                  decoration: InputDecoration(
                    hintText: "Age",
                    prefixIcon: Padding(
                      padding: const EdgeInsets.all(defaultPadding * 0.75),
                      child: Icon(
                        Icons.cake_outlined,
                        color: Theme.of(
                          context,
                        ).textTheme.bodyLarge!.color!.withOpacity(0.3),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: defaultPadding),
              Expanded(
                child: DropdownButtonFormField<String>(
                  value:
                      genderController.text.isEmpty
                          ? null
                          : genderController.text,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Gender is required';
                    }
                    return null;
                  },
                  decoration: InputDecoration(
                    hintText: "Gender",
                    prefixIcon: Padding(
                      padding: const EdgeInsets.all(defaultPadding * 0.75),
                      child: Icon(
                        Icons.wc_outlined,
                        color: Theme.of(
                          context,
                        ).textTheme.bodyLarge!.color!.withOpacity(0.3),
                      ),
                    ),
                  ),
                  dropdownColor: Theme.of(context).scaffoldBackgroundColor,
                  style: Theme.of(context).textTheme.bodyLarge,
                  icon: Icon(
                    Icons.keyboard_arrow_down,
                    color: Theme.of(
                      context,
                    ).textTheme.bodyLarge!.color!.withOpacity(0.5),
                  ),
                  borderRadius: BorderRadius.circular(12),
                  elevation: 8,
                  items: [
                    DropdownMenuItem(
                      value: 'male',
                      child: Text(
                        'Male',
                        style: TextStyle(
                          fontWeight: FontWeight.w500,
                          color: Theme.of(context).textTheme.bodyLarge!.color,
                        ),
                      ),
                    ),
                    DropdownMenuItem(
                      value: 'female',
                      child: Text(
                        'Female',
                        style: TextStyle(
                          fontWeight: FontWeight.w500,
                          color: Theme.of(context).textTheme.bodyLarge!.color,
                        ),
                      ),
                    ),
                  ],
                  onChanged: (value) {
                    genderController.text = value ?? '';
                  },
                ),
              ),
            ],
          ),
          const SizedBox(height: defaultPadding),
          TextFormField(
            controller: passwordController,
            validator: passwordValidator,
            obscureText: true,
            decoration: InputDecoration(
              hintText: "Password",
              prefixIcon: Padding(
                padding: const EdgeInsets.all(defaultPadding * 0.75),
                child: SvgPicture.asset(
                  "assets/icons/Lock.svg",
                  height: 24,
                  width: 24,
                  colorFilter: ColorFilter.mode(
                    Theme.of(
                      context,
                    ).textTheme.bodyLarge!.color!.withOpacity(0.3),
                    BlendMode.srcIn,
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: defaultPadding),
          TextFormField(
            controller: confirmPasswordController,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please confirm your password';
              }
              if (value != passwordController.text) {
                return 'Passwords do not match';
              }
              return null;
            },
            obscureText: true,
            decoration: InputDecoration(
              hintText: "Confirm Password",
              prefixIcon: Padding(
                padding: const EdgeInsets.all(defaultPadding * 0.75),
                child: SvgPicture.asset(
                  "assets/icons/Lock.svg",
                  height: 24,
                  width: 24,
                  colorFilter: ColorFilter.mode(
                    Theme.of(
                      context,
                    ).textTheme.bodyLarge!.color!.withOpacity(0.3),
                    BlendMode.srcIn,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
