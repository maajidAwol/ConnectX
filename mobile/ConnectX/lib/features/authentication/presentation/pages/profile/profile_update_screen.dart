import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
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

  Future<void> _pickImage() async {
    try {
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
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error picking image: $e')));
    }
  }

  Future<void> _takePhoto() async {
    try {
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
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error taking photo: $e')));
    }
  }

  void _showImageSourceActionSheet() {
    showModalBottomSheet(
      context: context,
      builder:
          (context) => SafeArea(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Padding(
                  padding: EdgeInsets.all(defaultPadding),
                  child: Text(
                    'Select Profile Photo',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                ),
                ListTile(
                  leading: const Icon(Icons.photo_library),
                  title: const Text('Choose from Gallery'),
                  onTap: () {
                    Navigator.pop(context);
                    _pickImage();
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.camera_alt),
                  title: const Text('Take Photo'),
                  onTap: () {
                    Navigator.pop(context);
                    _takePhoto();
                  },
                ),
                if (_avatarFile != null || _currentAvatarUrl != null)
                  ListTile(
                    leading: const Icon(Icons.delete, color: Colors.red),
                    title: const Text(
                      'Remove Photo',
                      style: TextStyle(color: Colors.red),
                    ),
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
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(const SnackBar(content: Text('No changes to update')));
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
            avatarWidget,
            Positioned(
              bottom: 0,
              right: 0,
              child: Container(
                decoration: BoxDecoration(
                  color: Theme.of(context).primaryColor,
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 2),
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
        actions: [
          BlocConsumer<ProfileBloc, ProfileState>(
            listener: (context, state) {
              if (state is ProfileUpdated) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Profile updated successfully!'),
                  ),
                );
                Navigator.pop(context);
                // Reload profile to show updated data
                context.read<ProfileBloc>().add(LoadProfile());
              } else if (state is ProfileUpdateError) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Error: ${state.message}')),
                );
              }
            },
            builder: (context, state) {
              return TextButton(
                onPressed: state is ProfileUpdating ? null : _updateProfile,
                child:
                    state is ProfileUpdating
                        ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                        : const Text('Save'),
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
                    const Column(
                      children: [
                        CircularProgressIndicator(),
                        SizedBox(height: defaultPadding),
                        Text('Updating profile...'),
                      ],
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
