import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '../../../../../constants.dart';

class SignUpForm extends StatelessWidget {
  const SignUpForm({
    super.key,
    required this.formKey,
    required this.emailController,
    required this.passwordController,
    required this.confirmPasswordController,
    required this.firstNameController,
    required this.lastNameController,
    required this.phoneController,
    required this.addressController,
    required this.selectedSex,
    required this.agreement,
    required this.onSexChanged,
    required this.onAgreementChanged,
  });

  final GlobalKey<FormState> formKey;
  final TextEditingController emailController;
  final TextEditingController passwordController;
  final TextEditingController confirmPasswordController;
  final TextEditingController firstNameController;
  final TextEditingController lastNameController;
  final TextEditingController phoneController;
  final TextEditingController addressController;
  final String selectedSex;
  final bool agreement;
  final Function(String?) onSexChanged;
  final Function(bool?) onAgreementChanged;

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
            controller: firstNameController,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'First name is required';
              }
              return null;
            },
            decoration: const InputDecoration(
              hintText: "First Name",
              prefixIcon: Icon(Icons.person_outline),
            ),
          ),
          const SizedBox(height: defaultPadding),
          TextFormField(
            controller: lastNameController,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Last name is required';
              }
              return null;
            },
            decoration: const InputDecoration(
              hintText: "Last Name",
              prefixIcon: Icon(Icons.person_outline),
            ),
          ),
          const SizedBox(height: defaultPadding),
          TextFormField(
            controller: emailController,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Email or phone number is required';
              }
              return null;
            },
            keyboardType: TextInputType.text,
            decoration: InputDecoration(
              hintText: "Email or phone number",
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
          TextFormField(
            controller: phoneController,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Phone number is required';
              }
              return null;
            },
            keyboardType: TextInputType.phone,
            decoration: const InputDecoration(
              hintText: "Phone Number",
              prefixIcon: Icon(Icons.phone),
            ),
          ),
          const SizedBox(height: defaultPadding),
          DropdownButtonFormField<String>(
            dropdownColor: Theme.of(context).scaffoldBackgroundColor,
            value: selectedSex,
            decoration: const InputDecoration(
              hintText: "Sex",
              prefixIcon: Icon(Icons.person_outline),
            ),
            style: Theme.of(context).textTheme.bodyLarge,
            icon: Icon(
              Icons.arrow_drop_down,
              color: Theme.of(context).iconTheme.color,
            ),
            borderRadius: BorderRadius.circular(8),
            items: [
              DropdownMenuItem(
                value: "male",
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: defaultPadding / 2,
                  ),
                  child: Text(
                    "Male",
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),
                ),
              ),
              DropdownMenuItem(
                value: "female",
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: defaultPadding / 2,
                  ),
                  child: Text(
                    "Female",
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),
                ),
              ),
            ],
            onChanged: onSexChanged,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please select your sex';
              }
              return null;
            },
          ),
          const SizedBox(height: defaultPadding),
          TextFormField(
            controller: addressController,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Address is required';
              }
              return null;
            },
            maxLines: 1,
            decoration: const InputDecoration(
              hintText: "Address",
              prefixIcon: Icon(Icons.location_on_outlined),
            ),
          ),
          const SizedBox(height: defaultPadding),
          TextFormField(
            controller: passwordController,
            validator: passwordValidator,
            // validator: passwordValidator.call,
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
          CheckboxListTile(
            value: agreement,
            onChanged: onAgreementChanged,
            title: const Text('I agree to the Terms and Conditions'),
            controlAffinity: ListTileControlAffinity.leading,
          ),
        ],
      ),
    );
  }
}
