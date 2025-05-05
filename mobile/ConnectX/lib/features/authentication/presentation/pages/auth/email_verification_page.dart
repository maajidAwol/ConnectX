import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:korecha/constants.dart';
import 'package:korecha/route/route_constants.dart';
import 'package:korecha/features/authentication/presentation/state/auth/bloc/auth_bloc.dart';



class EmailVerificationPage extends StatefulWidget {
  final String email;
  
  const EmailVerificationPage({super.key, required this.email});
  
  @override
  State<EmailVerificationPage> createState() => _EmailVerificationPageState();
}

class _EmailVerificationPageState extends State<EmailVerificationPage> {
  final _otpController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Email Verification')),
      body: BlocConsumer<AuthBloc, AuthState>(
        listener: (context, state) {
          if (state is AuthSuccess) {
            Navigator.pushNamedAndRemoveUntil(
              context, 
              entryPointScreenRoute,
              (route) => false,
            );
          } else if (state is AuthError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.message)),
            );
          }
        },
        builder: (context, state) {
          return Padding(
            padding: const EdgeInsets.all(defaultPadding),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('Please enter the verification code sent to ${widget.email}'),
                const SizedBox(height: defaultPadding),
                TextField(
                  controller: _otpController,
                  decoration: const InputDecoration(
                    labelText: 'Verification Code',
                  ),
                  keyboardType: TextInputType.number,
                ),
                const SizedBox(height: defaultPadding),
                ElevatedButton(
                  onPressed: () {
                    context.read<AuthBloc>().add(
                      VerifyEmailRequested(
                        email: widget.email,
                        otp: _otpController.text,
                      ),
                    );
                  },
                  child: const Text('Verify'),
                ),
                TextButton(
                  onPressed: () {
                    context.read<AuthBloc>().add(
                      ResendVerificationRequested(email: widget.email),
                    );
                  },
                  child: const Text('Resend Code'),
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
    _otpController.dispose();
    super.dispose();
  }
} 