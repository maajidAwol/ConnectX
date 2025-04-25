import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:korecha/constants.dart';
import 'package:korecha/features/authentication/presentation/state/auth/bloc/auth_bloc.dart';
import 'package:korecha/features/authentication/presentation/widgets/auth/signup_form.dart';

import 'package:korecha/route/route_constants.dart';

class SignUpScreen extends StatefulWidget {
  const SignUpScreen({super.key});

  @override
  State<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _addressController = TextEditingController();
  String _selectedSex = 'male';
  bool _agreement = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocConsumer<AuthBloc, AuthState>(
        listener: (context, state) {
          if (state is SignUpSuccess) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text(
                  'Registration successful! Please login to continue.',
                ),
                duration: Duration(seconds: 2),
              ),
            );

            // Navigate to login screen after showing the message
            Future.delayed(const Duration(seconds: 2), () {
              Navigator.pushNamedAndRemoveUntil(
                context,
                logInScreenRoute,
                (route) => false,
              );
            });
          } else if (state is AuthError) {
            ScaffoldMessenger.of(
              context,
            ).showSnackBar(SnackBar(content: Text(state.message)));
          }
        },
        builder: (context, state) {
          double height = MediaQuery.of(context).size.height;
          double width = MediaQuery.of(context).size.width;
          return SingleChildScrollView(
            child: Column(
              children: [
                // Image.asset(
                //   "assets/images/signUp_dark.png",
                //   height: MediaQuery.of(context).size.height * 0.35,
                //   width: double.infinity,
                //   fit: BoxFit.cover,
                // ),
                Padding(
                  padding: const EdgeInsets.only(
                    top: 70,
                    bottom: 0,
                    left: 0,
                    right: 0,
                  ),
                  child: SizedBox(
                    width: width * 0.6,
                    height: height * 0.16,
                    child: Image.asset("assets/koricha/logo-full.png"),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(defaultPadding),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text(
                        "Let's get started!",
                        style: Theme.of(context).textTheme.headlineMedium,
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: defaultPadding / 2),
                      const Text(
                        "Please enter your valid data in order \n to create an account.",
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: defaultPadding),
                      SignUpForm(
                        formKey: _formKey,
                        emailController: _emailController,
                        passwordController: _passwordController,
                        confirmPasswordController: _confirmPasswordController,
                        firstNameController: _firstNameController,
                        lastNameController: _lastNameController,
                        phoneController: _phoneController,
                        addressController: _addressController,
                        selectedSex: _selectedSex,
                        agreement: _agreement,
                        onSexChanged: (value) {
                          setState(() => _selectedSex = value ?? 'male');
                        },
                        onAgreementChanged: (value) {
                          setState(() => _agreement = value ?? false);
                        },
                      ),
                      const SizedBox(height: defaultPadding),
                      if (state is AuthLoading)
                        const Center(child: CircularProgressIndicator())
                      else
                        ElevatedButton(
                          onPressed: () {
                            if (_formKey.currentState!.validate() &&
                                _agreement) {
                              context.read<AuthBloc>().add(
                                SignUpRequested(
                                  email: _emailController.text,
                                  password: _passwordController.text,
                                  confirmPassword:
                                      _confirmPasswordController.text,
                                  firstName: _firstNameController.text,
                                  lastName: _lastNameController.text,
                                  phoneNumber: _phoneController.text,
                                  sex: _selectedSex,
                                  address: _addressController.text,
                                  agreement: _agreement,
                                ),
                              );
                            }
                          },
                          child: const Text("Sign Up"),
                        ),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Text("Already have an account?"),
                          TextButton(
                            onPressed: () {
                              Navigator.pushNamed(context, logInScreenRoute);
                            },
                            child: const Text("Log in"),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _firstNameController.dispose();
    _lastNameController.dispose();
    _phoneController.dispose();
    _addressController.dispose();
    super.dispose();
  }
}
