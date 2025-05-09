import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect } from 'react';
// next
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui
import { LoadingButton } from '@mui/lab';
import { Stack, Link, IconButton, InputAdornment, Alert } from '@mui/material';
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
      await login(data.email, data.password);
      // Redirect to the e-commerce landing page after successful login
      router.push(paths.eCommerce.landing);
    } catch (error) {
      console.error('Login error:', error);
      setLocalError(error instanceof Error ? error.message : 'Login failed');
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2.5}>
        {(error || localError) && (
          <Alert severity="error" onClose={() => { clearError(); setLocalError(null); }}>
            {error || localError}
          </Alert>
        )}

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
          component={NextLink}
          href={paths.resetPassword}
          variant="body2"
          underline="always"
          color="text.secondary"
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
      </Stack>
    </FormProvider>
  );
}
