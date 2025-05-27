import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect } from 'react';
// next
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui
import { LoadingButton } from '@mui/lab';
import { Stack, Link, IconButton, InputAdornment, Snackbar, Box } from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
// store
import { useAuthStore } from 'src/store/auth';

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
  password: string;
};

export default function AuthLoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { login, error, clearError, isLoading } = useAuthStore();
  const [localError, setLocalError] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('That is not an email'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password should be of minimum 6 characters length'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LoginSchema),
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
      
      await login(data.email, data.password);
      
      // Only show success and redirect after successful login
      setIsSuccess(true);
      setShowNotification(true);
      window.location.href = paths.eCommerce.landing;
    } catch (error) {
      let errorMessage = 'Incorrect email or password';
      
      if (error instanceof Error) {
        try {
          const errorData = JSON.parse(error.message);
          // Only show the essential error message
          if (errorData.details?.email || errorData.details?.password || errorData.message) {
            errorMessage = 'Incorrect email or password';
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
              {isSuccess ? 'Logging in...' : (error || localError)}
            </Box>
          </Box>
        </Snackbar>

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

        <Link
          component="button"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = paths.auth.resetPassword;
          }}
          variant="body2"
          underline="always"
          color="text.secondary"
          sx={{ 
            border: 'none', 
            background: 'none', 
            cursor: 'pointer', 
            p: 0,
            textAlign: 'left',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          Forgot password?
        </Link>

        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting || isLoading}
        >
          Login
        </LoadingButton>

        {/* Note: Social sign-in options (Google, GitHub, Facebook) are intentionally not included */}
      </Stack>
    </FormProvider>
  );
}
