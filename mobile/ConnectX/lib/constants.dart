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

// Coffee theme colors
const Color primaryColor = Color(0xFF6F4E37); // Rich coffee brown

const MaterialColor primaryMaterialColor =
    MaterialColor(0xFF6F4E37, <int, Color>{
  50: Color(0xFFF5F0ED), // Lightest coffee cream
  100: Color(0xFFE6D9D1), // Light coffee cream
  200: Color(0xFFD6C0B4), // Coffee with lots of cream
  300: Color(0xFFC5A696), // Latte color
  400: Color(0xFFB78F7B), // Cappuccino
  500: Color(0xFF6F4E37), // Primary coffee brown
  600: Color(0xFF664631), // Darker roast
  700: Color(0xFF5A3C2A), // Dark roast
  800: Color(0xFF4E3323), // Extra dark roast
  900: Color(0xFF3B2317), // Espresso dark
});

// Neutral and supporting colors
const Color blackColor = Color(0xFF2C1810); // Deep coffee black
const Color blackColor80 = Color(0xFF4A332B);
const Color blackColor60 = Color(0xFF695A54);
const Color blackColor40 = Color(0xFF8C817C);
const Color blackColor20 = Color(0xFFB0A8A5);
const Color blackColor10 = Color(0xFFD2CCC9);
const Color blackColor5 = Color(0xFFE9E6E4);

const Color whiteColor = Colors.white;
const Color whileColor80 = Color(0xFFE8E1DD);
const Color whileColor60 = Color(0xFFD1C5BE);
const Color whileColor40 = Color(0xFFBAA89F);
const Color whileColor20 = Color(0xFFA38C80);
const Color whileColor10 = Color(0xFF8C7062);
const Color whileColor5 = Color(0xFF755C4F);

const Color greyColor = Color(0xFFB8ACA3); // Warm grey
const Color lightGreyColor = Color(0xFFF5F1EE); // Light cream
const Color darkGreyColor = Color(0xFF2C1810); // Dark coffee

const Color purpleColor =
    Color(0xFF6F4E37); // Changed to coffee brown for consistency
const Color successColor = Color(0xFF2E7D32); // Forest green
const Color warningColor = Color(0xFFD4A056); // Caramel
const Color errorColor = Color(0xFFC62828); // Deep red

const double defaultPadding = 16.0;
const double defaultBorderRadious = 12.0;
const Duration defaultDuration = Duration(milliseconds: 300);

final passwordValidator = MultiValidator([
  RequiredValidator(errorText: 'Password is required'),
  MinLengthValidator(8, errorText: 'password must be at least 8 digits long'),
  PatternValidator(r'(?=.*?[#?!@$%^&*-])',
      errorText: 'passwords must have at least one special character')
]);

final emaildValidator = MultiValidator([
  RequiredValidator(errorText: 'Email is required'),
  EmailValidator(errorText: "Enter a valid email address"),
]);

const pasNotMatchErrorText = "passwords do not match";
