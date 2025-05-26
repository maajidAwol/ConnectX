import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:korecha/constants.dart';
import 'package:korecha/features/authentication/presentation/state/auth/bloc/auth_bloc.dart';
import 'package:korecha/features/authentication/presentation/widgets/auth/signup_form.dart';
import 'package:korecha/route/route_constants.dart';
import 'package:korecha/features/authentication/presentation/pages/auth/login_page.dart';

class SignUpScreen extends StatefulWidget {
  const SignUpScreen({super.key});

  @override
  State<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _ageController = TextEditingController();
  final _genderController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocConsumer<AuthBloc, AuthState>(
        listener: (context, state) {
          if (state is SignUpRedirectToLogin) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Registration successful! Please login.'),
                duration: Duration(seconds: 2),
              ),
            );

            Future.delayed(const Duration(seconds: 2), () {
              Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(
                  builder:
                      (context) => LoginScreen(
                        initialEmail: state.email,
                        initialPassword: state.password,
                      ),
                ),
                (route) => false,
              );
            });
          } else if (state is SignUpVerificationNeeded) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                duration: const Duration(seconds: 3),
              ),
            );

            Future.delayed(const Duration(seconds: 3), () {
              Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(
                  builder: (context) => LoginScreen(initialEmail: state.email),
                ),
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
                    child: Image.asset("assets/connectx/transparent_logo.png"),
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
                        "Create your account to continue.",
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: defaultPadding),
                      SignUpForm(
                        formKey: _formKey,
                        nameController: _nameController,
                        emailController: _emailController,
                        passwordController: _passwordController,
                        confirmPasswordController: _confirmPasswordController,
                        ageController: _ageController,
                        genderController: _genderController,
                      ),
                      const SizedBox(height: defaultPadding * 1.5),
                      if (state is AuthLoading)
                        const Center(child: CircularProgressIndicator())
                      else
                        ElevatedButton(
                          onPressed: () {
                            FocusScope.of(context).unfocus();
                            if (_formKey.currentState!.validate()) {
                              context.read<AuthBloc>().add(
                                SignUpRequested(
                                  name: _nameController.text,
                                  email: _emailController.text,
                                  password: _passwordController.text,
                                  age: int.tryParse(_ageController.text),
                                  gender: _genderController.text,
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
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _ageController.dispose();
    _genderController.dispose();
    super.dispose();
  }
}
