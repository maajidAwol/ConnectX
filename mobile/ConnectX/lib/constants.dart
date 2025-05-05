import 'package:flutter/material.dart';
import 'package:form_field_validator/form_field_validator.dart';

// Just for demo
const productDemoImg1 = "https://i.imgur.com/CGCyp1d.png";
const productDemoImg2 = "https://i.imgur.com/AkzWQuJ.png";
const productDemoImg3 = "https://i.imgur.com/J7mGZ12.png";
const productDemoImg4 = "https://i.imgur.com/q9oF9Yq.png";
const productDemoImg5 = "https://i.imgur.com/MsppAcx.png";
const productDemoImg6 = "https://i.imgur.com/JfyZlnO.png";

// End For demo

const grandisExtendedFont = "Grandis Extended";

// --- Sky Blue Theme Colors ---
const Color primaryColor = Color(0xFF039BE5); // Main blue color

const MaterialColor primaryMaterialColor = MaterialColor(
  0xFF039BE5,
  <int, Color>{
    50: Color(0xFFE1F5FE), // Lightest Sky Blue
    100: Color(0xFFB3E5FC), // Lighter Sky Blue
    200: Color(0xFF81D4FA), // Light Sky Blue
    300: Color(0xFF4FC3F7), // Sky Blue
    400: Color(0xFF29B6F6), // Bright Sky Blue
    500: Color(0xFF03A9F4), // Standard Blue
    600: Color(0xFF039BE5), // Primary blue (slightly darker)
    700: Color(0xFF0288D1), // Darker Blue
    800: Color(0xFF0277BD), // Even Darker Blue
    900: Color(0xFF01579B), // Deep Blue
  },
);

// --- Neutral and Supporting Colors ---
const Color blackColor = Colors.black; // Standard black
// Using standard Material grey shades instead of custom black opacities
const Color blackColor80 = Color(
  0xCC000000,
); // Keeping for potential direct usage, but prefer grey shades
const Color blackColor60 = Color(0x99000000);
const Color blackColor40 = Color(0x66000000);
const Color blackColor20 = Color(0x33000000);
const Color blackColor10 = Color(0x1A000000);
const Color blackColor5 = Color(0x0D000000);

const Color whiteColor = Colors.white;
// Removing coffee-themed 'whileColor' variants
// Use standard white with opacity (e.g., Colors.white70) or light grey shades if needed

const Color greyColor = Colors.grey; // Standard grey
const Color lightGreyColor = Color(0xFFEEEEEE); // Material Grey[200]
const Color darkGreyColor = Color(0xDD000000); // Colors.black87

// Functional Colors
const Color purpleColor = primaryColor; // Align with the new primary color
const Color successColor = Color(0xFF2E7D32); // Forest green (Keep)
const Color warningColor = Colors.amber; // Amber/Orange (Changed from Caramel)
const Color errorColor = Color(0xFFC62828); // Deep red (Keep)

// --- Defaults ---
const double defaultPadding = 16.0;
const double defaultBorderRadious = 12.0;
const Duration defaultDuration = Duration(milliseconds: 300);

final passwordValidator = MultiValidator([
  RequiredValidator(errorText: 'Password is required'),
  MinLengthValidator(8, errorText: 'password must be at least 8 digits long'),
  PatternValidator(
    r'(?=.*?[#?!@$%^&*-])',
    errorText: 'passwords must have at least one special character',
  ),
]);

final emaildValidator = MultiValidator([
  RequiredValidator(errorText: 'Email is required'),
  EmailValidator(errorText: "Enter a valid email address"),
]);

const pasNotMatchErrorText = "passwords do not match";
