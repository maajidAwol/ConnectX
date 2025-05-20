import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import { LoadingButton } from '@mui/lab';
import { Typography, Stack, Link, IconButton, InputAdornment, Alert } from '@mui/material';
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
      
      // Register the user under the tenant
      await registerUser(data.fullName, data.email, data.password);
      
      // Show success message
      setLocalError('Registration successful! Redirecting to login...');
      
      // Reset form
      reset();
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/auth/login-illustration');
      }, 2000);
      
    } catch (error) {
      console.error('Registration failed');
      setLocalError(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2.5}>
        {(error || localError) && (
          <Alert 
            severity={localError?.includes('successful') ? 'success' : 'error'} 
            onClose={() => { clearError(); setLocalError(null); }}
          >
            {error || localError}
          </Alert>
        )}

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
