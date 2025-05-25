import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import { LoadingButton } from '@mui/lab';
import { Typography, Stack, Link, IconButton, InputAdornment, Snackbar, Box } from '@mui/material';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
// store
import { useAuthStore } from 'src/store/auth';

// ----------------------------------------------------------------------

type FormValuesProps = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function AuthRegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser, error, clearError, isLoading } = useAuthStore();
  const [localError, setLocalError] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const RegisterSchema = Yup.object().shape({
    fullName: Yup.string()
      .required('Full name is required')
      .min(2, 'Minimum 2 characters')
      .max(50, 'Maximum 50 characters'),
    email: Yup.string().required('Email is required').email('That is not an email'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password should be of minimum 6 characters length')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
      ),
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password')], "Password's not match"),
  });

  const defaultValues = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    // Clear any previous errors when component mounts
    clearError();
    setLocalError(null);
  }, [clearError]);

  const onSubmit = async (data: FormValuesProps) => {
    try {
      setLocalError(null);
      setShowNotification(false);
      
      // Register the user under the tenant
      await registerUser(data.fullName, data.email, data.password);
      
      // Only show success after successful registration
      setIsSuccess(true);
      setShowNotification(true);
      
      // Reset form
      reset();
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/auth/login-illustration');
      }, 2000);
      
    } catch (error) {
      let errorMessage = 'Unable to register. Please try again.';
      
      if (error instanceof Error) {
        try {
          const errorData = JSON.parse(error.message);
          // Only show the essential error message
          if (errorData.details?.email) {
            errorMessage = 'This email is already registered';
          } else if (errorData.details?.password) {
            errorMessage = 'Password does not meet requirements';
          } else if (errorData.message) {
            errorMessage = 'Unable to register. Please try again.';
          }
        } catch {
          if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Unable to connect to the server. Please check your internet connection.';
          } else if (error.message.includes('timeout')) {
            errorMessage = 'The request timed out. Please try again.';
          }
        }
      }
      
      setLocalError(errorMessage);
      setShowNotification(true);
    }
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
    clearError();
    setLocalError(null);
    setIsSuccess(false);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2.5}>
        <Snackbar
          open={showNotification}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Box
            sx={{
              bgcolor: isSuccess ? 'success.main' : 'error.main',
              color: isSuccess ? 'success.contrastText' : 'error.contrastText',
              px: 3,
              py: 2,
              borderRadius: 1,
              boxShadow: (theme) => theme.shadows[3],
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              minWidth: 300,
              maxWidth: 400,
            }}
          >
            <Iconify 
              icon={isSuccess ? 'carbon:checkmark' : 'carbon:warning'} 
              width={24} 
              height={24} 
            />
            <Box sx={{ typography: 'body2' }}>
              {isSuccess ? 'Registration successful! Redirecting to login...' : (error || localError)}
            </Box>
          </Box>
        </Snackbar>

        <RHFTextField name="fullName" label="Full Name" />

        <RHFTextField name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'carbon:view' : 'carbon:view-off'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <RHFTextField
          name="confirmPassword"
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'carbon:view' : 'carbon:view-off'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting || isLoading}
          disabled={isSubmitting || isLoading}
        >
          Register
        </LoadingButton>

        <Typography variant="caption" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
          {`I agree to `}
          <Link color="text.primary" href="#" underline="always">
            Terms of Service
          </Link>
          {` and `}
          <Link color="text.primary" href="#" underline="always">
            Privacy Policy.
          </Link>
        </Typography>
      </Stack>
    </FormProvider>
  );
}
