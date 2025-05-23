import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:korecha/constants.dart';
import 'package:korecha/features/authentication/presentation/state/profile/bloc/profile_bloc.dart';

class ProfileUpdateScreen extends StatefulWidget {
  const ProfileUpdateScreen({super.key});

  @override
  State<ProfileUpdateScreen> createState() => _ProfileUpdateScreenState();
}

class _ProfileUpdateScreenState extends State<ProfileUpdateScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _bioController = TextEditingController();
  final _phoneController = TextEditingController();
  final ImagePicker _picker = ImagePicker();
  File? _avatarFile;
  String? _currentAvatarUrl;

  @override
  void initState() {
    super.initState();
    // Pre-populate form with current user data
    final state = context.read<ProfileBloc>().state;
    if (state is ProfileLoaded) {
      _nameController.text = state.user.name;
      _bioController.text = state.user.bio ?? '';
      _phoneController.text = state.user.phoneNumber ?? '';
      _currentAvatarUrl = state.user.avatar_url;
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _bioController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  Future<bool> _requestCameraPermission() async {
    final permission = await Permission.camera.request();
    return permission.isGranted;
  }

  Future<bool> _requestStoragePermission() async {
    Permission permission;
    if (Platform.isAndroid) {
      // For Android 13+ (API 33+), use photos permission
      if (await Permission.photos.isGranted) {
        return true;
      }
      permission = Permission.photos;
      final status = await permission.request();
      if (status.isGranted) return true;

      // Fallback to storage permission for older Android versions
      permission = Permission.storage;
    } else {
      // For iOS, use photos permission
      permission = Permission.photos;
    }

    final status = await permission.request();
    return status.isGranted;
  }

  void _showPermissionDialog({
    required String title,
    required String message,
    required VoidCallback onSettingsPressed,
  }) {
    showDialog(
      context: context,
      builder:
          (context) => AlertDialog(
            title: Text(title),
            content: Text(message),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Cancel'),
              ),
              TextButton(
                onPressed: () {
                  Navigator.pop(context);
                  onSettingsPressed();
                },
                child: const Text('Settings'),
              ),
            ],
          ),
    );
  }

  Future<void> _openAppSettings() async {
    await openAppSettings();
  }

  Future<void> _pickImage() async {
    try {
      // Check storage permission
      final hasPermission = await _requestStoragePermission();

      if (!hasPermission) {
        _showPermissionDialog(
          title: 'Storage Permission Required',
          message:
              'Please allow access to your photos to select an image. '
              'You can enable this in your device settings.',
          onSettingsPressed: _openAppSettings,
        );
        return;
      }

      final XFile? pickedFile = await _picker.pickImage(
        source: ImageSource.gallery,
        maxWidth: 1024,
        maxHeight: 1024,
        imageQuality: 85,
      );

      if (pickedFile != null) {
        setState(() {
          _avatarFile = File(pickedFile.path);
        });
      }
    } catch (e) {
      _handleImageError('Error accessing gallery', e);
    }
  }

  Future<void> _takePhoto() async {
    try {
      // Check camera permission
      final hasPermission = await _requestCameraPermission();

      if (!hasPermission) {
        _showPermissionDialog(
          title: 'Camera Permission Required',
          message:
              'Please allow camera access to take photos. '
              'You can enable this in your device settings.',
          onSettingsPressed: _openAppSettings,
        );
        return;
      }

      final XFile? pickedFile = await _picker.pickImage(
        source: ImageSource.camera,
        maxWidth: 1024,
        maxHeight: 1024,
        imageQuality: 85,
      );

      if (pickedFile != null) {
        setState(() {
          _avatarFile = File(pickedFile.path);
        });
      }
    } catch (e) {
      _handleImageError('Error accessing camera', e);
    }
  }

  void _handleImageError(String operation, dynamic error) {
    String errorMessage = '$operation: ';

    if (error.toString().contains('permission')) {
      errorMessage += 'Permission denied. Please check your app permissions.';
    } else if (error.toString().contains('camera')) {
      errorMessage += 'Camera not available on this device.';
    } else {
      errorMessage += 'An unexpected error occurred. Please try again.';
    }

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(errorMessage),
        action: SnackBarAction(label: 'Settings', onPressed: _openAppSettings),
      ),
    );
  }

  void _showImageSourceActionSheet() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder:
          (context) => SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: defaultPadding),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: Colors.grey[300],
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                  const Padding(
                    padding: EdgeInsets.all(defaultPadding),
                    child: Text(
                      'Select Profile Photo',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  ListTile(
                    leading: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.blue.withOpacity(0.1),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.photo_library,
                        color: Colors.blue,
                      ),
                    ),
                    title: const Text('Choose from Gallery'),
                    subtitle: const Text('Select an existing photo'),
                    onTap: () {
                      Navigator.pop(context);
                      _pickImage();
                    },
                  ),
                  ListTile(
                    leading: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.green.withOpacity(0.1),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.camera_alt, color: Colors.green),
                    ),
                    title: const Text('Take Photo'),
                    subtitle: const Text('Use your camera'),
                    onTap: () {
                      Navigator.pop(context);
                      _takePhoto();
                    },
                  ),
                  if (_avatarFile != null || _currentAvatarUrl != null)
                    ListTile(
                      leading: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.red.withOpacity(0.1),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.delete, color: Colors.red),
                      ),
                      title: const Text(
                        'Remove Photo',
                        style: TextStyle(color: Colors.red),
                      ),
                      subtitle: const Text('Delete current photo'),
                      onTap: () {
                        Navigator.pop(context);
                        setState(() {
                          _avatarFile = null;
                          _currentAvatarUrl = null;
                        });
                      },
                    ),
                  const SizedBox(height: defaultPadding),
                ],
              ),
            ),
          ),
    );
  }

  void _updateProfile() {
    if (_formKey.currentState!.validate()) {
      final state = context.read<ProfileBloc>().state;
      if (state is ProfileLoaded) {
        // Only include fields that have changed
        String? name =
            _nameController.text.trim() != state.user.name
                ? _nameController.text.trim()
                : null;
        String? bio =
            _bioController.text.trim() != (state.user.bio ?? '')
                ? _bioController.text.trim()
                : null;
        String? phoneNumber =
            _phoneController.text.trim() != (state.user.phoneNumber ?? '')
                ? _phoneController.text.trim()
                : null;
        String? avatarPath = _avatarFile?.path;

        // Only proceed if there are changes
        if (name != null ||
            bio != null ||
            phoneNumber != null ||
            avatarPath != null) {
          context.read<ProfileBloc>().add(
            UpdateProfileEvent(
              name: name,
              bio: bio,
              phoneNumber: phoneNumber,
              avatarPath: avatarPath,
            ),
          );
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('No changes to update'),
              backgroundColor: Colors.orange,
            ),
          );
        }
      }
    }
  }

  String getInitials(String name) =>
      name.isNotEmpty
          ? name.trim().split(' ').map((l) => l[0]).take(2).join().toUpperCase()
          : '';

  Widget _buildAvatarSection() {
    Widget avatarWidget;
    final initials = getInitials(_nameController.text);

    if (_avatarFile != null) {
      // Show selected file
      avatarWidget = ClipOval(
        child: Image.file(
          _avatarFile!,
          width: 120,
          height: 120,
          fit: BoxFit.cover,
        ),
      );
    } else if (_currentAvatarUrl != null && _currentAvatarUrl!.isNotEmpty) {
      // Show current avatar
      avatarWidget = ClipOval(
        child: Image.network(
          _currentAvatarUrl!,
          width: 120,
          height: 120,
          fit: BoxFit.cover,
          loadingBuilder: (context, child, loadingProgress) {
            if (loadingProgress == null) return child;
            return Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                color: Colors.grey[200],
                shape: BoxShape.circle,
              ),
              child: const Center(
                child: CircularProgressIndicator(strokeWidth: 2),
              ),
            );
          },
          errorBuilder:
              (context, error, stackTrace) => Container(
                width: 120,
                height: 120,
                decoration: BoxDecoration(
                  color: Theme.of(context).primaryColor.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Text(
                    initials,
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).primaryColor,
                    ),
                  ),
                ),
              ),
        ),
      );
    } else {
      // Show initials
      avatarWidget = Container(
        width: 120,
        height: 120,
        decoration: BoxDecoration(
          color: Theme.of(context).primaryColor.withOpacity(0.1),
          shape: BoxShape.circle,
        ),
        child: Center(
          child: Text(
            initials,
            style: TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.bold,
              color: Theme.of(context).primaryColor,
            ),
          ),
        ),
      );
    }

    return Column(
      children: [
        Stack(
          children: [
            Container(
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: avatarWidget,
            ),
            Positioned(
              bottom: 0,
              right: 0,
              child: Container(
                decoration: BoxDecoration(
                  color: Theme.of(context).primaryColor,
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 3),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.2),
                      blurRadius: 5,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: IconButton(
                  icon: const Icon(
                    Icons.camera_alt,
                    color: Colors.white,
                    size: 20,
                  ),
                  onPressed: _showImageSourceActionSheet,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: defaultPadding / 2),
        Text(
          'Tap the camera icon to change photo',
          style: Theme.of(
            context,
          ).textTheme.bodySmall?.copyWith(color: Colors.grey[600]),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Profile'),
        elevation: 0,
        actions: [
          BlocConsumer<ProfileBloc, ProfileState>(
            listener: (context, state) {
              if (state is ProfileUpdated) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Profile updated successfully!'),
                    backgroundColor: Colors.green,
                    behavior: SnackBarBehavior.floating,
                  ),
                );
                Navigator.pop(context);
                // Reload profile to show updated data
                context.read<ProfileBloc>().add(LoadProfile());
              } else if (state is ProfileUpdateError) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Error: ${state.message}'),
                    backgroundColor: Colors.red,
                    behavior: SnackBarBehavior.floating,
                    action: SnackBarAction(
                      label: 'Retry',
                      textColor: Colors.white,
                      onPressed: _updateProfile,
                    ),
                  ),
                );
              }
            },
            builder: (context, state) {
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8.0),
                child: TextButton(
                  onPressed: state is ProfileUpdating ? null : _updateProfile,
                  style: TextButton.styleFrom(
                    foregroundColor:
                        state is ProfileUpdating
                            ? Colors.grey
                            : Theme.of(context).primaryColor,
                  ),
                  child:
                      state is ProfileUpdating
                          ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                          : const Text(
                            'Save',
                            style: TextStyle(fontWeight: FontWeight.bold),
                          ),
                ),
              );
            },
          ),
        ],
      ),
      body: BlocBuilder<ProfileBloc, ProfileState>(
        builder: (context, state) {
          if (state is ProfileLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          return SingleChildScrollView(
            padding: const EdgeInsets.all(defaultPadding),
            child: Form(
              key: _formKey,
              child: Column(
                children: [
                  _buildAvatarSection(),
                  const SizedBox(height: defaultPadding * 2),
                  TextFormField(
                    controller: _nameController,
                    decoration: const InputDecoration(
                      labelText: 'Full Name',
                      hintText: 'Enter your full name',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.person_outline),
                    ),
                    validator: (value) {
                      if (value == null || value.trim().isEmpty) {
                        return 'Name is required';
                      }
                      return null;
                    },
                    onChanged: (value) {
                      setState(() {}); // Rebuild to update initials
                    },
                  ),
                  const SizedBox(height: defaultPadding),
                  TextFormField(
                    controller: _bioController,
                    decoration: const InputDecoration(
                      labelText: 'Bio',
                      hintText: 'Tell us about yourself',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.info_outline),
                    ),
                    maxLines: 3,
                    maxLength: 150,
                  ),
                  const SizedBox(height: defaultPadding),
                  TextFormField(
                    controller: _phoneController,
                    decoration: const InputDecoration(
                      labelText: 'Phone Number',
                      hintText: 'Enter your phone number',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.phone_outlined),
                    ),
                    keyboardType: TextInputType.phone,
                  ),
                  const SizedBox(height: defaultPadding * 2),
                  if (state is ProfileUpdating)
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(defaultPadding),
                        child: Row(
                          children: [
                            const CircularProgressIndicator(),
                            const SizedBox(width: defaultPadding),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Updating profile...',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  Text(
                                    'Please wait while we save your changes',
                                    style: TextStyle(
                                      color: Colors.grey[600],
                                      fontSize: 12,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
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
}
