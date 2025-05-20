import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect } from 'react';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Typography, Stack, IconButton, InputAdornment, Alert, Button } from '@mui/material';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
// store
import { useAuthStore } from 'src/store/auth';
//
import { EcommerceAccountLayout } from '../layout';

// ----------------------------------------------------------------------

const API_URL = 'https://connectx-9agd.onrender.com/api';

// ----------------------------------------------------------------------

export default function EcommerceAccountPersonalView() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // New state for avatar editing
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [avatarFileToUpload, setAvatarFileToUpload] = useState<File | null>(null);
  const [avatarPreviewToUpload, setAvatarPreviewToUpload] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const { user, accessToken, updateUser } = useAuthStore();

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const EcommerceAccountPersonalSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email address is required').email('Email must be valid'),
    phone_number: Yup.string().nullable(),
    bio: Yup.string().nullable(),
    oldPassword: Yup.string().when('showPasswordSection', {
      is: true,
      then: (schema) => schema.required('Current password is required'),
    }),
    newPassword: Yup.string().when('showPasswordSection', {
      is: true,
      then: (schema) => schema.min(4, 'Password must be at least 4 characters'),
    }),
    confirmNewPassword: Yup.string().when('showPasswordSection', {
      is: true,
      then: (schema) => schema.oneOf([Yup.ref('newPassword')], 'Passwords must match'),
    }),
  });

  const defaultValues = {
    name: user?.name || '',
    email: user?.email || '',
    phone_number: user?.phone_number || '',
    bio: user?.bio || '',
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    showPasswordSection: false,
  };

  const methods = useForm({
    resolver: yupResolver(EcommerceAccountPersonalSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (user) {
      reset(defaultValues);
    }
  }, [user, reset]);

  useEffect(() => {
    setValue('showPasswordSection', showPasswordSection);
  }, [showPasswordSection, setValue]);

  // Handlers for Avatar Update
  const handleEditAvatarClick = () => {
    setIsEditingAvatar(true);
    setAvatarError(null);
  };

  const handleCancelAvatarClick = () => {
    setIsEditingAvatar(false);
    setAvatarFileToUpload(null);
    setAvatarPreviewToUpload(null);
    setAvatarError(null);
  };

  const handleAvatarFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFileToUpload(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreviewToUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarFileToUpload(null);
      setAvatarPreviewToUpload(null);
    }
    setAvatarError(null);
  };

  const handleAvatarUpload = async () => {
    if (!avatarFileToUpload) {
      setAvatarError('Please select an image to upload.');
      return;
    }

    try {
      setIsUploadingAvatar(true);
      setAvatarError(null);

      if (!user?.id) {
        throw new Error('User ID not found');
      }

      const currentAccessToken = accessToken;
      if (!currentAccessToken) {
        throw new Error('Authentication required. Please login again.');
      }

      const formData = new FormData();
      formData.append('avatar', avatarFileToUpload);

      const response = await fetch(`${API_URL}/users/update-profile/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${currentAccessToken}`,
        },
        body: formData,
      });

      if (response.status === 401) {
         // Token might be expired, try to refresh
         const refreshResponse = await fetch(`${API_URL}/auth/refresh/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refresh: useAuthStore.getState().refreshToken
          }),
        });

        if (!refreshResponse.ok) {
          throw new Error('Session expired. Please login again.');
        }

        const {
          access
        } = await refreshResponse.json();

        // Update the access token in the store
        useAuthStore.setState({
          accessToken: access
        });

        // Retry the original request with the new token
        const retryResponse = await fetch(`${API_URL}/users/update-profile/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${access}`,
          },
          body: formData,
        });

        if (!retryResponse.ok) {
          throw new Error('Failed to update avatar after token refresh');
        }

        const updatedUser = await retryResponse.json();
        updateUser(updatedUser);
      } else if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorData.message || 'Failed to update avatar';
        } catch {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      } else {
        const updatedUser = await response.json();
        updateUser(updatedUser);
      }

      // Success
      setIsEditingAvatar(false);
      setAvatarFileToUpload(null);
      setAvatarPreviewToUpload(null);
      setSuccess('Avatar updated successfully');

    } catch (error) {
      console.error('Avatar upload error:', error);
      setAvatarError(error instanceof Error ? error.message : 'Failed to upload avatar');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const onSubmit = async (data: typeof defaultValues) => {
    try {
      setError(null);
      setSuccess(null);

      if (!user?.id) {
        throw new Error('User ID not found');
      }

      // Get the current access token
      const currentAccessToken = accessToken;
      if (!currentAccessToken) {
        throw new Error('Authentication required. Please login again.');
      }

      // Create FormData object for main profile update
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone_number', data.phone_number || '');
      formData.append('bio', data.bio || '');
      if (showPasswordSection && data.newPassword) {
        formData.append('password', data.newPassword);
      }
      // Do NOT include avatar here anymore, it's handled separately
      formData.append('role', user.role);

      const response = await fetch(`${API_URL}/users/update-profile/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${currentAccessToken}`,
        },
        body: formData,
      });

      if (response.status === 401) {
        // Token might be expired, try to refresh
        const refreshResponse = await fetch(`${API_URL}/auth/refresh/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refresh: useAuthStore.getState().refreshToken
          }),
        });

        if (!refreshResponse.ok) {
          throw new Error('Session expired. Please login again.');
        }

        const {
          access
        } = await refreshResponse.json();

        // Update the access token in the store
        useAuthStore.setState({
          accessToken: access
        });

        // Retry the original request with the new token
        const retryResponse = await fetch(`${API_URL}/users/update-profile/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${access}`,
          },
          body: formData,
        });

        if (!retryResponse.ok) {
          throw new Error('Failed to update profile after token refresh');
        }

        const updatedUser = await retryResponse.json();
        updateUser(updatedUser);
      } else if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorData.message || 'Failed to update profile';
        } catch {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      } else {
        const updatedUser = await response.json();
        updateUser(updatedUser);
      }

      setSuccess('Profile updated successfully');

      // Reset password fields and hide password section
      reset({
        ...data,
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        showPasswordSection: false,
      });
      setShowPasswordSection(false);
    } catch (error) {
      console.error('Update error:', error);
      setError(error instanceof Error ? error.message : 'Failed to update profile');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <EcommerceAccountLayout>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Personal Information
      </Typography>

      {/* Avatar Section */}
      <Stack direction="column" alignItems="center" spacing={2} sx={{ mb: 5 }}>
        <Box sx={{ position: 'relative', width: 120, height: 120 }}>
          <img
            src={avatarPreviewToUpload || user.avatar_url || '/placeholder-avatar.jpg'} // Use preview if available, otherwise user's avatar or placeholder
            alt="Avatar"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #e0e0e0',
            }}
          />
          {!isEditingAvatar && (
            <IconButton
              onClick={handleEditAvatarClick}
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'background.neutral' },
              }}
            >
              <Iconify icon="carbon:edit" width={20} />
            </IconButton>
          )}
        </Box>

        {isEditingAvatar && (
          <Stack direction="column" alignItems="center" spacing={1.5}>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarFileChange}
              style={{ display: 'none' }}
              id="avatar-upload"
            />
            <label htmlFor="avatar-upload">
              <Button variant="outlined" component="span">
                {avatarFileToUpload ? avatarFileToUpload.name : 'Choose New Avatar'}
              </Button>
            </label>

            {avatarFileToUpload && avatarPreviewToUpload && (
              <Box sx={{ mt: 1, textAlign: 'center' }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Preview:</Typography>
                 {/* Preview is now handled by the main img tag using avatarPreviewToUpload */}
              </Box>
            )}

            <Stack direction="row" spacing={1}>
              <LoadingButton
                variant="contained"
                color="primary"
                onClick={handleAvatarUpload}
                loading={isUploadingAvatar}
                disabled={!avatarFileToUpload}
              >
                Save
              </LoadingButton>
              <Button variant="outlined" color="inherit" onClick={handleCancelAvatarClick} disabled={isUploadingAvatar}>
                Cancel
              </Button>
            </Stack>
            {avatarError && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {avatarError}
              </Typography>
            )}
          </Stack>
        )}

      </Stack>

      {/* Main Profile Form */}
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        <Box
          rowGap={2.5}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
          }}
        >
          <RHFTextField name="name" label="Full Name" />
          <RHFTextField name="email" label="Email Address" />
          <RHFTextField name="phone_number" label="Phone Number" />
          <RHFTextField name="bio" label="Bio" multiline rows={3} />
        </Box>


        <Box sx={{ mt: 3, mb: 3 }}>
          <Button
            variant="outlined"
            onClick={() => setShowPasswordSection(!showPasswordSection)}
            startIcon={<Iconify icon={showPasswordSection ? 'carbon:subtract' : 'carbon:add'} />}
          >
            {showPasswordSection ? 'Hide Password Change' : 'Change Password'}
          </Button>
        </Box>

        {showPasswordSection && (
          <Stack spacing={2.5}>
            <RHFTextField
              name="oldPassword"
              label="Current Password"
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword} edge="end">
                      <Iconify icon={showPassword ? 'carbon:view' : 'carbon:view-off'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <RHFTextField
              name="newPassword"
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword} edge="end">
                      <Iconify icon={showPassword ? 'carbon:view' : 'carbon:view-off'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <RHFTextField
              name="confirmNewPassword"
              label="Confirm New Password"
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword} edge="end">
                      <Iconify icon={showPassword ? 'carbon:view' : 'carbon:view-off'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        )}

        <LoadingButton
          sx={{ mt: 3 }}
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Save Changes
        </LoadingButton>
      </FormProvider>
    </EcommerceAccountLayout>
  );
}
