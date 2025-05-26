import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:korecha/constants.dart';
import 'package:korecha/route/route_constants.dart';

import 'package:korecha/features/authentication/presentation/state/auth/bloc/auth_bloc.dart';
import 'package:korecha/features/authentication/presentation/widgets/auth/login_form.dart';
import 'package:korecha/features/authentication/presentation/pages/auth/email_verification_page.dart';
import 'package:korecha/core/services/storage_service.dart';
import 'package:get_it/get_it.dart';

class LoginScreen extends StatefulWidget {
  final String? initialEmail;
  final String? initialPassword;

  const LoginScreen({super.key, this.initialEmail, this.initialPassword});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void initState() {
    super.initState();
    if (widget.initialEmail != null) {
      _emailController.text = widget.initialEmail!;
    }
    if (widget.initialPassword != null) {
      _passwordController.text = widget.initialPassword!;
    } else {
      _loadSavedCredentials();
    }
  }

  void _loadSavedCredentials() {
    final storageService = GetIt.I<StorageService>();
    if (_emailController.text.isEmpty) {
      final savedEmail = storageService.getUserEmail();
      if (savedEmail != null) {
        _emailController.text = savedEmail;
      }
    }
    if (_passwordController.text.isEmpty) {
      final savedPassword = storageService.getUserPassword();
      if (savedPassword != null) {
        _passwordController.text = savedPassword;
      }
    }
  }

  void _handleLogin() {
    FocusScope.of(context).unfocus();

    if (_formKey.currentState!.validate()) {
      context.read<AuthBloc>().add(
        LoginRequested(
          email: _emailController.text,
          password: _passwordController.text,
        ),
      );

      GetIt.I<StorageService>().saveUserCredentials(
        _emailController.text,
        _passwordController.text,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocConsumer<AuthBloc, AuthState>(
        listener: (context, state) {
          if (state is AuthVerificationRequired) {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => EmailVerificationPage(email: state.email),
              ),
            );
          } else if (state is AuthSuccess) {
            Navigator.pushNamedAndRemoveUntil(
              context,
              entryPointScreenRoute,
              ModalRoute.withName(logInScreenRoute),
            );
          } else if (state is AuthError) {
            // print(state.message);
            ScaffoldMessenger.of(
              context,
            ).showSnackBar(SnackBar(content: Text(state.message)));
          }
          if (state is LogoutSuccess) {
            _emailController.clear();
            _passwordController.clear();
            // GetIt.I<StorageService>().clearUserCredentials();
          }
        },
        builder: (context, state) {
          double width = MediaQuery.of(context).size.width;
          double height = MediaQuery.of(context).size.height;
          return Center(
            child: SingleChildScrollView(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Padding(
                    padding: const EdgeInsets.only(
                      top: 0,
                      bottom: 0,
                      left: 0,
                      right: 0,
                    ),
                    child: SizedBox(
                      width: width * 0.6,
                      height: height * 0.16,
                      child: Image.asset(
                        "assets/connectx/transparent_logo.png",
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(defaultPadding),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Text(
                          "Welcome back to ConnectX!",
                          style: Theme.of(context).textTheme.headlineSmall,
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: defaultPadding / 2),
                        const Text(
                          "Log in with your data that you entered during \n your registration.",
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: defaultPadding),
                        LogInForm(
                          formKey: _formKey,
                          emailController: _emailController,
                          passwordController: _passwordController,
                        ),
                        const SizedBox(height: defaultPadding / 2),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            // TextButton(
                            //   onPressed: () {
                            //     // TODO: Implement forgot email functionality
                            //     ScaffoldMessenger.of(context).showSnackBar(
                            //       const SnackBar(
                            //         content: Text(
                            //           'Forgot email functionality will be implemented soon',
                            //         ),
                            //         duration: Duration(seconds: 2),
                            //       ),
                            //     );
                            //   },
                            //   child: Text(
                            //     "Forgot Email?",
                            //     style: TextStyle(
                            //       color: Theme.of(context).primaryColor,
                            //       fontWeight: FontWeight.w500,
                            //     ),
                            //   ),
                            // ),
                            TextButton(
                              onPressed: () {
                                // TODO: Implement forgot password functionality
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text(
                                      'Forgot password functionality will be implemented soon',
                                    ),
                                    duration: Duration(seconds: 2),
                                  ),
                                );
                              },
                              child: Text(
                                "Forgot Password?",
                                style: TextStyle(
                                  color: Theme.of(context).primaryColor,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                          ],
                        ),
                        SizedBox(
                          height:
                              MediaQuery.of(context).size.height > 700
                                  ? MediaQuery.of(context).size.height * 0.05
                                  : defaultPadding / 2,
                        ),
                        ElevatedButton(
                          onPressed: _handleLogin,
                          child:
                              state is AuthLoading
                                  ? const SizedBox(
                                    height: 20,
                                    width: 20,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                    ),
                                  )
                                  : const Text("Log in"),
                        ),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text("Don't have an account?"),
                            TextButton(
                              onPressed: () {
                                Navigator.pushNamed(context, signUpScreenRoute);
                              },
                              child: const Text("Sign up"),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
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
    super.dispose();
  }
}
