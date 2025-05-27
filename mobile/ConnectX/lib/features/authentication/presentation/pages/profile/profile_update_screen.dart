import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:image_picker/image_picker.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:korecha/constants.dart';
import 'package:korecha/features/authentication/presentation/state/profile/bloc/profile_bloc.dart';
import 'package:korecha/components/custom_modal_bottom_sheet.dart';

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
    // Simple approach like camera permission
    final permission = await Permission.photos.request();
    return permission.isGranted;
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
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(defaultBorderRadious),
            ),
            title: Text(title),
            content: Text(message),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Cancel'),
              ),
              ElevatedButton(
                onPressed: () {
                  Navigator.pop(context);
                  onSettingsPressed();
                },
                child: const Text('Open Settings'),
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
          title: 'Photos Permission Required',
          message: 'Please allow access to photos to select an image.',
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
          message: 'Please allow camera access to take photos.',
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
        backgroundColor: errorColor,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(defaultBorderRadious),
        ),
      ),
    );
  }

  void _showImageSourceActionSheet() {
    customModalBottomSheet(
      context,
      height: MediaQuery.of(context).size.height * 0.32,
      child: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: defaultPadding,
          vertical: defaultPadding / 2,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                margin: const EdgeInsets.only(bottom: defaultPadding / 2),
                decoration: BoxDecoration(
                  color: greyColor.withOpacity(0.3),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            Text(
              'Select Profile Photo',
              style: Theme.of(
                context,
              ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: defaultPadding / 2),

            _buildImageSourceOption(
              icon: "assets/icons/Image.svg",
              title: 'Choose from Gallery',
              subtitle: 'Select an existing photo',
              onTap: () {
                Navigator.pop(context);
                _pickImage();
              },
            ),

            const SizedBox(height: defaultPadding / 4),

            _buildImageSourceOption(
              icon: "assets/icons/Camera-Bold.svg",
              title: 'Take Photo',
              subtitle: 'Use your camera',
              onTap: () {
                Navigator.pop(context);
                _takePhoto();
              },
            ),

            if (_avatarFile != null || _currentAvatarUrl != null) ...[
              const SizedBox(height: defaultPadding / 4),
              _buildImageSourceOption(
                icon: "assets/icons/Delete.svg",
                title: 'Remove Photo',
                subtitle: 'Delete current photo',
                isDestructive: true,
                onTap: () {
                  Navigator.pop(context);
                  setState(() {
                    _avatarFile = null;
                    _currentAvatarUrl = null;
                  });
                },
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildImageSourceOption({
    required String icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
    bool isDestructive = false,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(defaultBorderRadious),
        child: Container(
          padding: const EdgeInsets.symmetric(
            horizontal: defaultPadding / 2,
            vertical: defaultPadding / 2,
          ),
          decoration: BoxDecoration(
            border: Border.all(color: greyColor.withOpacity(0.2)),
            borderRadius: BorderRadius.circular(defaultBorderRadious),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color:
                      isDestructive
                          ? errorColor.withOpacity(0.1)
                          : greyColor.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: SvgPicture.asset(
                  icon,
                  height: 20,
                  width: 20,
                  colorFilter: ColorFilter.mode(
                    isDestructive ? errorColor : greyColor,
                    BlendMode.srcIn,
                  ),
                ),
              ),
              const SizedBox(width: defaultPadding / 2),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      title,
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        fontWeight: FontWeight.w600,
                        color: isDestructive ? errorColor : null,
                      ),
                    ),
                    Text(
                      subtitle,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: greyColor,
                        fontSize: 11,
                      ),
                    ),
                  ],
                ),
              ),
              Icon(
                Icons.arrow_forward_ios,
                size: 14,
                color: greyColor.withOpacity(0.6),
              ),
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
            SnackBar(
              content: const Text('No changes to update'),
              backgroundColor: warningColor,
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(defaultBorderRadious),
              ),
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
          width: 100,
          height: 100,
          fit: BoxFit.cover,
        ),
      );
    } else if (_currentAvatarUrl != null && _currentAvatarUrl!.isNotEmpty) {
      // Show current avatar
      avatarWidget = ClipOval(
        child: Image.network(
          _currentAvatarUrl!,
          width: 100,
          height: 100,
          fit: BoxFit.cover,
          loadingBuilder: (context, child, loadingProgress) {
            if (loadingProgress == null) return child;
            return Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                color: lightGreyColor,
                shape: BoxShape.circle,
              ),
              child: const Center(
                child: CircularProgressIndicator(strokeWidth: 2),
              ),
            );
          },
          errorBuilder:
              (context, error, stackTrace) => Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  color: primaryColor.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Text(
                    initials,
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: primaryColor,
                    ),
                  ),
                ),
              ),
        ),
      );
    } else {
      // Show initials
      avatarWidget = Container(
        width: 100,
        height: 100,
        decoration: BoxDecoration(
          color: primaryColor.withOpacity(0.1),
          shape: BoxShape.circle,
        ),
        child: Center(
          child: Text(
            initials,
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: primaryColor,
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
                    color: primaryColor.withOpacity(0.2),
                    blurRadius: 20,
                    offset: const Offset(0, 8),
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
                  color: primaryColor,
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 3),
                  boxShadow: [
                    BoxShadow(
                      color: primaryColor.withOpacity(0.3),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: IconButton(
                  icon: SvgPicture.asset(
                    "assets/icons/Camera-add.svg",
                    height: 18,
                    width: 18,
                    colorFilter: const ColorFilter.mode(
                      Colors.white,
                      BlendMode.srcIn,
                    ),
                  ),
                  onPressed: _showImageSourceActionSheet,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: defaultPadding / 2),
        Text(
          'Tap camera to change photo',
          style: Theme.of(
            context,
          ).textTheme.bodySmall?.copyWith(color: greyColor),
        ),
      ],
    );
  }

  Widget _buildFormSection() {
    return Container(
      padding: const EdgeInsets.all(defaultPadding),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(defaultBorderRadious),
        border: Border.all(color: primaryColor.withOpacity(0.1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: primaryColor.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: SvgPicture.asset(
                  "assets/icons/Profile.svg",
                  height: 16,
                  width: 16,
                  colorFilter: ColorFilter.mode(primaryColor, BlendMode.srcIn),
                ),
              ),
              const SizedBox(width: defaultPadding / 2),
              Text(
                'Personal Information',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: primaryColor,
                ),
              ),
            ],
          ),
          const SizedBox(height: defaultPadding),

          TextFormField(
            controller: _nameController,
            decoration: const InputDecoration(
              labelText: 'Full Name *',
              hintText: 'Enter your full name',
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
              hintText: 'Tell us about yourself (optional)',
              prefixIcon: Icon(Icons.info_outline),
            ),
            maxLines: 3,
            maxLength: 150,
          ),

          const SizedBox(height: defaultPadding / 2),

          TextFormField(
            controller: _phoneController,
            decoration: const InputDecoration(
              labelText: 'Phone Number',
              hintText: 'Enter your phone number (optional)',
              prefixIcon: Icon(Icons.phone_outlined),
            ),
            keyboardType: TextInputType.phone,
          ),
        ],
      ),
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
                  SnackBar(
                    content: const Row(
                      children: [
                        Icon(Icons.check_circle, color: Colors.white),
                        SizedBox(width: 8),
                        Text('Profile updated successfully!'),
                      ],
                    ),
                    backgroundColor: successColor,
                    behavior: SnackBarBehavior.floating,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(defaultBorderRadious),
                    ),
                  ),
                );
                Navigator.pop(context);
                // Reload profile to show updated data
                context.read<ProfileBloc>().add(LoadProfile());
              } else if (state is ProfileUpdateError) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Row(
                      children: [
                        const Icon(Icons.error, color: Colors.white),
                        const SizedBox(width: 8),
                        Expanded(child: Text('Error: ${state.message}')),
                      ],
                    ),
                    backgroundColor: errorColor,
                    behavior: SnackBarBehavior.floating,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(defaultBorderRadious),
                    ),
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
                  child:
                      state is ProfileUpdating
                          ? const SizedBox(
                            width: 16,
                            height: 16,
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
                mainAxisSize: MainAxisSize.min,
                children: [
                  _buildAvatarSection(),
                  const SizedBox(height: defaultPadding * 1.5),
                  _buildFormSection(),
                  const SizedBox(height: defaultPadding),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
