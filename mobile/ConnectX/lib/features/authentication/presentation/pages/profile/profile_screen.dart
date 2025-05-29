// // import 'package:flutter/material.dart';
// // import 'package:flutter_svg/svg.dart';
// // import 'package:shop/components/list_tile/divider_list_tile.dart';
// // import 'package:shop/components/network_image_with_loader.dart';
// // import 'package:shop/constants.dart';
// // import 'package:shop/route/screen_export.dart';
// // import 'dart:io';
// // import 'package:image_picker/image_picker.dart';
// // import 'package:permission_handler/permission_handler.dart';
// // import 'package:intl/intl.dart';



// // class ProfileScreen extends StatefulWidget {
// //   const ProfileScreen({super.key});

// //   @override
// //   State<ProfileScreen> createState() => _ProfileScreenState();
// // }

// // class _ProfileScreenState extends State<ProfileScreen> {
// //   bool isEditing = false;
// //   File? _profileImage;
// //   final ImagePicker _picker = ImagePicker();

// //   // User data
// //   String name = "Sepide Moqadas";
// //   String email = "Sepide@piqo.design";
// //   String dateOfBirth = "10/31/1997";
// //   String phoneNumber = "+1-202-555-0162";
// //   String gender = "Female";

// //   // Controllers for editing
// //   final TextEditingController _nameController = TextEditingController();
// //   final TextEditingController _emailController = TextEditingController();
// //   final TextEditingController _phoneController = TextEditingController();
// //   String? _selectedGender;
// //   DateTime? _selectedDate;

// //   @override
// //   void initState() {
// //     super.initState();
// //     _nameController.text = name;
// //     _emailController.text = email;
// //     _phoneController.text = phoneNumber.replaceAll("-", " ");
// //     _selectedGender = gender;

// //     // Parse the date string
// //     try {
// //       final parts = dateOfBirth.split('/');
// //       if (parts.length == 3) {
// //         _selectedDate = DateTime(
// //           int.parse(parts[2]), // year
// //           int.parse(parts[0]), // month
// //           int.parse(parts[1]), // day
// //         );
// //       }
// //     } catch (e) {
// //       print('Error parsing date: $e');
// //     }
// //   }

// //   Future<void> _requestCameraPermission() async {
// //     var status = await Permission.camera.request();
// //     if (status.isGranted) {
// //       _pickImage(ImageSource.camera);
// //     } else {
// //       ScaffoldMessenger.of(context).showSnackBar(
// //         const SnackBar(content: Text('Camera permission is required')),
// //       );
// //     }
// //   }

// //   Future<void> _pickImage(ImageSource source) async {
// //     try {
// //       final XFile? pickedFile = await _picker.pickImage(source: source);
// //       if (pickedFile != null) {
// //         setState(() {
// //           _profileImage = File(pickedFile.path);
// //         });
// //       }
// //     } catch (e) {
// //       ScaffoldMessenger.of(context).showSnackBar(
// //         SnackBar(content: Text('Error picking image: $e')),
// //       );
// //     }
// //   }

// //   void _showImageSourceActionSheet() {
// //     showModalBottomSheet(
// //       context: context,
// //       builder: (context) => SafeArea(
// //         child: Wrap(
// //           children: [
// //             ListTile(
// //               leading: const Icon(Icons.photo_library),
// //               title: const Text('Photo Library'),
// //               onTap: () {
// //                 Navigator.of(context).pop();
// //                 _pickImage(ImageSource.gallery);
// //               },
// //             ),
// //             ListTile(
// //               leading: const Icon(Icons.photo_camera),
// //               title: const Text('Camera'),
// //               onTap: () {
// //                 Navigator.of(context).pop();
// //                 _requestCameraPermission();
// //               },
// //             ),
// //           ],
// //         ),
// //       ),
// //     );
// //   }

// //   Future<void> _selectDate(BuildContext context) async {
// //     final DateTime? picked = await showDatePicker(
// //       context: context,
// //       initialDate: _selectedDate ?? DateTime.now(),
// //       firstDate: DateTime(1900),
// //       lastDate: DateTime.now(),
// //     );
// //     if (picked != null && picked != _selectedDate) {
// //       setState(() {
// //         _selectedDate = picked;
// //       });
// //     }
// //   }

// //   String get formattedDate {
// //     if (_selectedDate == null) return "Not set";
// //     return DateFormat('MMM d, yyyy').format(_selectedDate!);
// //   }

// //   String get shortFormattedDate {
// //     if (_selectedDate == null) return "";
// //     return DateFormat('MM/dd/yyyy').format(_selectedDate!);
// //   }

// //   void _toggleEditMode() {
// //     setState(() {
// //       if (isEditing) {
// //         // Save changes
// //         name = _nameController.text;
// //         email = _emailController.text;
// //         phoneNumber = _phoneController.text;
// //         gender = _selectedGender ?? gender;
// //         dateOfBirth = shortFormattedDate;
// //       }
// //       isEditing = !isEditing;
// //     });
// //   }

// //   @override
// //   void dispose() {
// //     _nameController.dispose();
// //     _emailController.dispose();
// //     _phoneController.dispose();
// //     super.dispose();
// //   }

// //   @override
// //   Widget build(BuildContext context) {
// //     return Scaffold(
// //       backgroundColor: Colors.white,
// //       appBar: AppBar(
// //         backgroundColor: Colors.white,
// //         elevation: 0,
// //         centerTitle: true,
// //         title: const Text(
// //           'Profile',
// //           style: TextStyle(
// //             color: Colors.black87,
// //             fontWeight: FontWeight.w500,
// //           ),
// //         ),
// //         leading: IconButton(
// //           icon: const Icon(Icons.arrow_back, color: Colors.black87),
// //           onPressed: () => Navigator.of(context).pop(),
// //         ),
// //         actions: [
// //           if (!isEditing)
// //             TextButton(
// //               onPressed: _toggleEditMode,
// //               child: const Text(
// //                 'Edit',
// //                 style: TextStyle(
// //                   color: primaryColor,
// //                   fontWeight: FontWeight.w500,
// //                 ),
// //               ),
// //             ),
// //           if (isEditing)
// //             IconButton(
// //               icon: const Icon(Icons.info_outline, color: Colors.black87),
// //               onPressed: () {
// //                 // Show profile info
// //               },
// //             ),
// //         ],
// //       ),
// //       body: isEditing ? _buildEditProfile() : _buildViewProfile(),
// //     );
// //   }

// //   Widget _buildViewProfile() {
// //     return SingleChildScrollView(
// //       child: Padding(
// //         padding: const EdgeInsets.all(16.0),
// //         child: Column(
// //           children: [
// //             // Profile Header
// //             Row(
// //               children: [
// //                 CircleAvatar(
// //                   radius: 40,
// //                   backgroundImage: _profileImage != null
// //                       ? FileImage(_profileImage!) as ImageProvider
// //                       : const NetworkImage("https://i.imgur.com/IXnwbLk.png"),
// //                 ),
// //                 const SizedBox(width: 20),
// //                 Column(
// //                   crossAxisAlignment: CrossAxisAlignment.start,
// //                   children: [
// //                     Text(
// //                       name,
// //                       style: const TextStyle(
// //                         fontSize: 20,
// //                         fontWeight: FontWeight.bold,
// //                       ),
// //                     ),
// //                     Text(
// //                       email,
// //                       style: TextStyle(
// //                         fontSize: 16,
// //                         color: Colors.grey[600],
// //                       ),
// //                     ),
// //                   ],
// //                 )
// //               ],
// //             ),

// //             const SizedBox(height: 30),

// //             // Profile Details
// //             _buildProfileDetailItem('Name', name.split(' ')[0]),
// //             _buildProfileDetailItem('Date of birth',
// //                 dateOfBirth.isNotEmpty ? "Oct 31, 1997" : "Not set"),
// //             _buildProfileDetailItem('Phone number', phoneNumber),
// //             _buildProfileDetailItem('Gender', gender),
// //             _buildProfileDetailItem('Email', email),

// //             // Password change option
// //             Container(
// //               decoration: BoxDecoration(
// //                 border: Border(
// //                   bottom: BorderSide(
// //                     color: Colors.grey[300]!,
// //                     width: 1.0,
// //                   ),
// //                 ),
// //               ),
// //               padding: const EdgeInsets.symmetric(vertical: 16.0),
// //               child: Row(
// //                 mainAxisAlignment: MainAxisAlignment.spaceBetween,
// //                 children: [
// //                   const Text(
// //                     'Password',
// //                     style: TextStyle(
// //                       fontSize: 16,
// //                       color: Colors.grey,
// //                     ),
// //                   ),
// //                   TextButton(
// //                     onPressed: () {
// //                       // Handle password change
// //                     },
// //                     child: const Text(
// //                       'Change Password',
// //                       style: TextStyle(
// //                         color: primaryColor,
// //                         fontWeight: FontWeight.w500,
// //                       ),
// //                     ),
// //                   ),
// //                 ],
// //               ),
// //             ),
// //           ],
// //         ),
// //       ),
// //     );
// //   }

// //   Widget _buildProfileDetailItem(String label, String value) {
// //     return Container(
// //       decoration: BoxDecoration(
// //         border: Border(
// //           bottom: BorderSide(
// //             color: Colors.grey[300]!,
// //             width: 1.0,
// //           ),
// //         ),
// //       ),
// //       padding: const EdgeInsets.symmetric(vertical: 16.0),
// //       child: Row(
// //         mainAxisAlignment: MainAxisAlignment.spaceBetween,
// //         children: [
// //           Text(
// //             label,
// //             style: const TextStyle(
// //               fontSize: 16,
// //               color: Colors.grey,
// //             ),
// //           ),
// //           Text(
// //             value,
// //             style: const TextStyle(
// //               fontSize: 16,
// //               fontWeight: FontWeight.w500,
// //             ),
// //           ),
// //         ],
// //       ),
// //     );
// //   }

// //   Widget _buildEditProfile() {
// //     return SingleChildScrollView(
// //       child: Padding(
// //         padding: const EdgeInsets.all(16.0),
// //         child: Column(
// //           children: [
// //             // Profile Picture Edit
// //             Center(
// //               child: Stack(
// //                 children: [
// //                   CircleAvatar(
// //                     radius: 60,
// //                     backgroundImage: _profileImage != null
// //                         ? FileImage(_profileImage!) as ImageProvider
// //                         : const NetworkImage("https://i.imgur.com/IXnwbLk.png"),
// //                   ),
// //                   Positioned(
// //                     bottom: 0,
// //                     right: 0,
// //                     child: GestureDetector(
// //                       onTap: _showImageSourceActionSheet,
// //                       child: Container(
// //                         height: 40,
// //                         width: 40,
// //                         decoration: BoxDecoration(
// //                           color: primaryColor,
// //                           shape: BoxShape.circle,
// //                         ),
// //                         child: const Icon(
// //                           Icons.edit,
// //                           color: Colors.white,
// //                           size: 20,
// //                         ),
// //                       ),
// //                     ),
// //                   ),
// //                 ],
// //               ),
// //             ),

// //             const SizedBox(height: 10),

// //             // Edit photo text
// //             TextButton(
// //               onPressed: _showImageSourceActionSheet,
// //               child: const Text(
// //                 'Edit photo',
// //                 style: TextStyle(
// //                   color: primaryColor,
// //                   fontSize: 16,
// //                   fontWeight: FontWeight.w500,
// //                 ),
// //               ),
// //             ),

// //             const SizedBox(height: 20),

// //             // Edit Form Fields
// //             _buildProfileInputField(
// //               icon: Icons.person_outline,
// //               value: _nameController.text,
// //               controller: _nameController,
// //             ),
// //             _buildProfileInputField(
// //               icon: Icons.email_outlined,
// //               value: _emailController.text,
// //               controller: _emailController,
// //               enabled: false, // Assuming email can't be changed
// //             ),
// //             _buildDatePickerField(),
// //             _buildPhoneInputField(),

// //             const SizedBox(height: 40),

// //             // Done Button
// //             SizedBox(
// //               width: double.infinity,
// //               child: ElevatedButton(
// //                 onPressed: _toggleEditMode,
// //                 style: ElevatedButton.styleFrom(
// //                   foregroundColor: Colors.white,
// //                   backgroundColor: primaryColor,
// //                   padding: const EdgeInsets.symmetric(vertical: 15),
// //                   shape: RoundedRectangleBorder(
// //                     borderRadius: BorderRadius.circular(30.0),
// //                   ),
// //                 ),
// //                 child: const Text(
// //                   'Done',
// //                   style: TextStyle(
// //                     fontSize: 16,
// //                     fontWeight: FontWeight.w500,
// //                   ),
// //                 ),
// //               ),
// //             ),
// //           ],
// //         ),
// //       ),
// //     );
// //   }

// //   Widget _buildProfileInputField({
// //     required IconData icon,
// //     required String value,
// //     required TextEditingController controller,
// //     bool enabled = true,
// //   }) {
// //     return Container(
// //       margin: const EdgeInsets.only(bottom: 16.0),
// //       padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
// //       decoration: BoxDecoration(
// //         color: Colors.grey[100],
// //         borderRadius: BorderRadius.circular(15.0),
// //       ),
// //       child: Row(
// //         children: [
// //           Icon(icon, color: Colors.grey),
// //           const SizedBox(width: 16.0),
// //           Expanded(
// //             child: TextField(
// //               controller: controller,
// //               enabled: enabled,
// //               decoration: const InputDecoration(
// //                 border: InputBorder.none,
// //                 contentPadding: EdgeInsets.zero,
// //               ),
// //               style: const TextStyle(
// //                 fontSize: 16.0,
// //               ),
// //             ),
// //           ),
// //         ],
// //       ),
// //     );
// //   }

// //   Widget _buildDatePickerField() {
// //     return GestureDetector(
// //       onTap: () => _selectDate(context),
// //       child: Container(
// //         margin: const EdgeInsets.only(bottom: 16.0),
// //         padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 16.0),
// //         decoration: BoxDecoration(
// //           color: Colors.grey[100],
// //           borderRadius: BorderRadius.circular(15.0),
// //         ),
// //         child: Row(
// //           children: [
// //             const Icon(Icons.calendar_today, color: Colors.grey),
// //             const SizedBox(width: 16.0),
// //             Text(
// //               _selectedDate != null
// //                   ? DateFormat('MM/dd/yyyy').format(_selectedDate!)
// //                   : "Select Date of Birth",
// //               style: TextStyle(
// //                 fontSize: 16.0,
// //                 color: _selectedDate != null ? Colors.black : Colors.grey,
// //               ),
// //             ),
// //           ],
// //         ),
// //       ),
// //     );
// //   }

// //   Widget _buildPhoneInputField() {
// //     return Container(
// //       margin: const EdgeInsets.only(bottom: 16.0),
// //       decoration: BoxDecoration(
// //         color: Colors.grey[100],
// //         borderRadius: BorderRadius.circular(15.0),
// //       ),
// //       child: Row(
// //         children: [
// //           // Country code section
// //           Container(
// //             padding:
// //                 const EdgeInsets.symmetric(horizontal: 16.0, vertical: 16.0),
// //             child: const Text(
// //               '+1',
// //               style: TextStyle(
// //                 fontSize: 16.0,
// //               ),
// //             ),
// //           ),

// //           // Separator
// //           Container(
// //             height: 30,
// //             width: 1,
// //             color: Colors.grey[400],
// //           ),

// //           // Phone number input
// //           Expanded(
// //             child: Padding(
// //               padding: const EdgeInsets.only(left: 16.0),
// //               child: TextField(
// //                 controller: _phoneController,
// //                 keyboardType: TextInputType.phone,
// //                 decoration: const InputDecoration(
// //                   border: InputBorder.none,
// //                   hintText: 'Phone Number',
// //                 ),
// //               ),
// //             ),
// //           ),
// //         ],
// //       ),
// //     );
// //   }
// // }
// import 'package:flutter/material.dart';
// import 'package:shop/constants.dart';
// import 'package:intl/intl.dart';
// import 'dart:io';
// import 'package:image_picker/image_picker.dart';
// import 'package:permission_handler/permission_handler.dart';

// class ProfilePage extends StatefulWidget {
//   const ProfilePage({Key? key}) : super(key: key);

//   @override
//   _ProfilePageState createState() => _ProfilePageState();
// }

// class _ProfilePageState extends State<ProfilePage> {
//   bool isEditing = false;
//   File? _profileImage;
//   final ImagePicker _picker = ImagePicker();

//   // User data
//   String name = "Sepide Moqadasig";
//   String email = "Sepide@piqo.design";
//   String dateOfBirth = "10/31/1997";
//   String phoneNumber = "+1-202-555-0162";
//   String gender = "Female";

//   // Controllers for editing
//   final TextEditingController _nameController = TextEditingController();
//   final TextEditingController _emailController = TextEditingController();
//   final TextEditingController _phoneController = TextEditingController();
//   String? _selectedGender;
//   DateTime? _selectedDate;

//   @override
//   void initState() {
//     super.initState();
//     _nameController.text = name;
//     _emailController.text = email;
//     _phoneController.text = phoneNumber;
//     _selectedGender = gender;

//     // Parse the date string
//     try {
//       final parts = dateOfBirth.split('/');
//       if (parts.length == 3) {
//         _selectedDate = DateTime(
//           int.parse(parts[2]), // year
//           int.parse(parts[0]), // month
//           int.parse(parts[1]), // dayl
//         );
//       }
//     } catch (e) {
//       print('Error parsing date: $e');
//     }
//   }

//   Future<void> _requestCameraPermission() async {
//     var status = await Permission.camera.request();
//     if (status.isGranted) {
//       _pickImage(ImageSource.camera);
//     } else {
//       ScaffoldMessenger.of(context).showSnackBar(
//         const SnackBar(content: Text('Camera permission is required')),
//       );
//     }
//   }

//   Future<void> _pickImage(ImageSource source) async {
//     try {
//       final XFile? pickedFile = await _picker.pickImage(source: source);
//       if (pickedFile != null) {
//         setState(() {
//           _profileImage = File(pickedFile.path);
//         });
//       }
//     } catch (e) {
//       ScaffoldMessenger.of(context).showSnackBar(
//         SnackBar(content: Text('Error picking image: $e')),
//       );
//     }
//   }

//   void _showImageSourceActionSheet() {
//     showModalBottomSheet(
//       context: context,
//       builder: (context) => SafeArea(
//         child: Wrap(
//           children: [
//             ListTile(
//               leading: const Icon(Icons.photo_library),
//               title: const Text('Photo Library'),
//               onTap: () {
//                 Navigator.of(context).pop();
//                 _pickImage(ImageSource.gallery);
//               },
//             ),
//             ListTile(
//               leading: const Icon(Icons.photo_camera),
//               title: const Text('Camera'),
//               onTap: () {
//                 Navigator.of(context).pop();
//                 _requestCameraPermission();
//               },
//             ),
//           ],
//         ),
//       ),
//     );
//   }

//   Future<void> _selectDate(BuildContext context) async {
//     final DateTime? picked = await showDatePicker(
//       context: context,
//       initialDate: _selectedDate ?? DateTime.now(),
//       firstDate: DateTime(1900),
//       lastDate: DateTime.now(),
//     );
//     if (picked != null && picked != _selectedDate) {
//       setState(() {
//         _selectedDate = picked;
//       });
//     }
//   }

//   String get formattedDate {
//     if (_selectedDate == null) return "Not set";
//     return DateFormat('MMM d, yyyy').format(_selectedDate!);
//   }

//   String get shortFormattedDate {
//     if (_selectedDate == null) return "";
//     return DateFormat('MM/dd/yyyy').format(_selectedDate!);
//   }

//   void _toggleEditMode() {
//     setState(() {
//       if (isEditing) {
//         // Save changes
//         name = _nameController.text;
//         email = _emailController.text;
//         phoneNumber = _phoneController.text;
//         gender = _selectedGender ?? gender;
//         dateOfBirth = shortFormattedDate;
//       }
//       isEditing = !isEditing;
//     });
//   }

//   @override
//   void dispose() {
//     _nameController.dispose();
//     _emailController.dispose();
//     _phoneController.dispose();
//     super.dispose();
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         backgroundColor: Colors.transparent,
//         elevation: 0,
//         centerTitle: true,
//         title: const Text(
//           'Profile',
//           style: TextStyle(
//             color: Colors.black87,
//             fontWeight: FontWeight.w500,
//           ),
//         ),
//         leading: IconButton(
//           icon: const Icon(Icons.arrow_back, color: Colors.black87),
//           onPressed: () => Navigator.of(context).pop(),
//         ),
//         actions: [
//           if (!isEditing)
//             TextButton(
//               onPressed: _toggleEditMode,
//               child: const Text(
//                 'Edit',
//                 style: TextStyle(
//                   color: primaryColor,
//                   fontWeight: FontWeight.w500,
//                 ),
//               ),
//             ),
//           if (isEditing)
//             IconButton(
//               icon: const Icon(Icons.info_outline, color: Colors.black87),
//               onPressed: () {
//                 // Show profile info
//               },
//             ),
//         ],
//       ),
//       body: isEditing ? _buildEditProfile() : _buildViewProfile(),
//     );
//   }

//   Widget _buildViewProfile() {
//     return SingleChildScrollView(
//       child: Padding(
//         padding: const EdgeInsets.all(16.0),
//         child: Column(
//           children: [
//             // Profile Header
//             Row(
//               children: [
//                 CircleAvatar(
//                   radius: 40,
//                   backgroundImage: _profileImage != null
//                       ? FileImage(_profileImage!) as ImageProvider
//                       : const AssetImage(
//                           'assets/images/profile_placeholder.png'),
//                 ),
//                 const SizedBox(width: 20),
//                 Column(
//                   crossAxisAlignment: CrossAxisAlignment.start,
//                   children: [
//                     Text(
//                       name,
//                       style: const TextStyle(
//                         fontSize: 20,
//                         fontWeight: FontWeight.bold,
//                       ),
//                     ),
//                     Text(
//                       email,
//                       style: TextStyle(
//                         fontSize: 16,
//                         color: Colors.grey[600],
//                       ),
//                     ),
//                   ],
//                 )
//               ],
//             ),

//             const SizedBox(height: 30),

//             // Profile Details
//             _buildProfileDetailItem('Name', name),
//             _buildProfileDetailItem(
//                 'Date of birth',
//                 dateOfBirth.isNotEmpty
//                     ? DateFormat('MMM d, yyyy')
//                         .format(DateFormat('MM/dd/yyyy').parse(dateOfBirth))
//                     : "Not set"),
//             _buildProfileDetailItem('Phone number', phoneNumber),
//             _buildProfileDetailItem('Gender', gender),
//             _buildProfileDetailItem('Email', email),

//             // Password change option
//             Container(
//               decoration: BoxDecoration(
//                 border: Border(
//                   bottom: BorderSide(
//                     color: Colors.grey[300]!,
//                     width: 1.0,
//                   ),
//                 ),
//               ),
//               padding: const EdgeInsets.symmetric(vertical: 16.0),
//               child: Row(
//                 mainAxisAlignment: MainAxisAlignment.spaceBetween,
//                 children: [
//                   const Text(
//                     'Password',
//                     style: TextStyle(
//                       fontSize: 16,
//                       color: Colors.grey,
//                     ),
//                   ),
//                   TextButton(
//                     onPressed: () {
//                       // Handle password change
//                     },
//                     child: const Text(
//                       'Change Password',
//                       style: TextStyle(
//                         color: primaryColor,
//                         fontWeight: FontWeight.w500,
//                       ),
//                     ),
//                   ),
//                 ],
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }

//   Widget _buildProfileDetailItem(String label, String value) {
//     return Container(
//       decoration: BoxDecoration(
//         border: Border(
//           bottom: BorderSide(
//             color: Colors.grey[300]!,
//             width: 1.0,
//           ),
//         ),
//       ),
//       padding: const EdgeInsets.symmetric(vertical: 16.0),
//       child: Row(
//         mainAxisAlignment: MainAxisAlignment.spaceBetween,
//         children: [
//           Text(
//             label,
//             style: const TextStyle(
//               fontSize: 16,
//               color: Colors.grey,
//             ),
//           ),
//           Text(
//             value,
//             style: const TextStyle(
//               fontSize: 16,
//               fontWeight: FontWeight.w500,
//             ),
//           ),
//         ],
//       ),
//     );
//   }

//   Widget _buildEditProfile() {
//     return SingleChildScrollView(
//       child: Padding(
//         padding: const EdgeInsets.all(16.0),
//         child: Column(
//           children: [
//             // Profile Picture Edit
//             Center(
//               child: Stack(
//                 children: [
//                   CircleAvatar(
//                     radius: 60,
//                     backgroundImage: _profileImage != null
//                         ? FileImage(_profileImage!) as ImageProvider
//                         : const AssetImage(
//                             'assets/images/profile_placeholder.png'),
//                   ),
//                   Positioned(
//                     bottom: 0,
//                     right: 0,
//                     child: GestureDetector(
//                       onTap: _showImageSourceActionSheet,
//                       child: Container(
//                         height: 40,
//                         width: 40,
//                         decoration: BoxDecoration(
//                           color: primaryColor,
//                           shape: BoxShape.circle,
//                         ),
//                         child: const Icon(
//                           Icons.edit,
//                           color: Colors.white,
//                           size: 20,
//                         ),
//                       ),
//                     ),
//                   ),
//                 ],
//               ),
//             ),

//             const SizedBox(height: 10),

//             // Edit photo text
//             TextButton(
//               onPressed: _showImageSourceActionSheet,
//               child: const Text(
//                 'Edit photo',
//                 style: TextStyle(
//                   color: primaryColor,
//                   fontSize: 16,
//                   fontWeight: FontWeight.w500,
//                 ),
//               ),
//             ),

//             const SizedBox(height: 20),

//             // Edit Form Fields
//             _buildProfileInputField(
//               icon: Icons.person_outline,
//               value: _nameController.text,
//               controller: _nameController,
//             ),
//             _buildProfileInputField(
//               icon: Icons.email_outlined,
//               value: _emailController.text,
//               controller: _emailController,
//               enabled: false, // Assuming email can't be changed
//             ),
//             _buildDatePickerField(),
//             _buildPhoneInputField(),

//             const SizedBox(height: 40),

//             // Done Button
//             SizedBox(
//               width: double.infinity,
//               child: ElevatedButton(
//                 onPressed: _toggleEditMode,
//                 style: ElevatedButton.styleFrom(
//                   foregroundColor: Colors.white,
//                   backgroundColor: primaryColor,
//                   padding: const EdgeInsets.symmetric(vertical: 15),
//                   shape: RoundedRectangleBorder(
//                     borderRadius: BorderRadius.circular(30.0),
//                   ),
//                 ),
//                 child: const Text(
//                   'Done',
//                   style: TextStyle(
//                     fontSize: 16,
//                     fontWeight: FontWeight.w500,
//                   ),
//                 ),
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }

//   Widget _buildProfileInputField({
//     required IconData icon,
//     required String value,
//     required TextEditingController controller,
//     bool enabled = true,
//   }) {
//     return Container(
//       margin: const EdgeInsets.only(bottom: 16.0),
//       padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 16.0),
//       decoration: BoxDecoration(
//         color: Colors.grey[100],
//         borderRadius: BorderRadius.circular(15.0),
//       ),
//       child: Row(
//         children: [
//           Icon(icon, color: Colors.grey),
//           const SizedBox(width: 16.0),
//           Expanded(
//             child: TextField(
//               controller: controller,
//               enabled: enabled,
//               decoration: const InputDecoration(
//                 border: InputBorder.none,
//                 contentPadding: EdgeInsets.zero,
//               ),
//               style: const TextStyle(
//                 fontSize: 16.0,
//               ),
//             ),
//           ),
//         ],
//       ),
//     );
//   }

//   Widget _buildDatePickerField() {
//     return GestureDetector(
//       onTap: () => _selectDate(context),
//       child: Container(
//         margin: const EdgeInsets.only(bottom: 16.0),
//         padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 16.0),
//         decoration: BoxDecoration(
//           color: Colors.grey[100],
//           borderRadius: BorderRadius.circular(15.0),
//         ),
//         child: Row(
//           children: [
//             const Icon(Icons.calendar_today, color: Colors.grey),
//             const SizedBox(width: 16.0),
//             Text(
//               _selectedDate != null
//                   ? DateFormat('MM/dd/yyyy').format(_selectedDate!)
//                   : "Select Date of Birth",
//               style: TextStyle(
//                 fontSize: 16.0,
//                 color: _selectedDate != null ? Colors.black : Colors.grey,
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }

//   Widget _buildPhoneInputField() {
//     return Container(
//       margin: const EdgeInsets.only(bottom: 16.0),
//       decoration: BoxDecoration(
//         color: Colors.grey[100],
//         borderRadius: BorderRadius.circular(15.0),
//       ),
//       child: Row(
//         children: [
//           // Country code section
//           Container(
//             padding: const EdgeInsets.all(16.0),
//             child: const Text(
//               '+1',
//               style: TextStyle(
//                 fontSize: 16.0,
//               ),
//             ),
//           ),

//           // Separator
//           Container(
//             height: 30,
//             width: 1,
//             color: Colors.grey[400],
//           ),

//           // Phone number input
//           Expanded(
//             child: Padding(
//               padding: const EdgeInsets.only(left: 16.0),
//               child: TextField(
//                 controller: _phoneController,
//                 keyboardType: TextInputType.phone,
//                 decoration: const InputDecoration(
//                   border: InputBorder.none,
//                   hintText: 'Phone Number',
//                 ),
//               ),
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }