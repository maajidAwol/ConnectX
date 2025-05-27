import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import { LoadingButton } from '@mui/lab';
import { 
  Typography, 
  Stack, 
  Link, 
  IconButton, 
  InputAdornment, 
  Snackbar, 
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
} from '@mui/material';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
// store
import { useAuthStore } from 'src/store/auth';

// ----------------------------------------------------------------------

type FormValuesProps = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  age: number;
};

export default function AuthRegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser, error, clearError, isLoading } = useAuthStore();
  const [localError, setLocalError] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const RegisterSchema = Yup.object().shape({
    name: Yup.string()
      .required('Full name is required')
      .min(2, 'Minimum 2 characters')
      .max(50, 'Maximum 50 characters'),
    email: Yup.string()
      .required('Email is required')
      .email('That is not an email'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
      ),
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password')], "Passwords don't match"),
    gender: Yup.string()
      .required('Gender is required')
      .oneOf(['male', 'female'], 'Please select a valid gender'),
    age: Yup.number()
      .required('Age is required')
      .min(13, 'You must be at least 13 years old')
      .max(120, 'Please enter a valid age'),
  });

  const defaultValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    age: 18,
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, isValid, errors },
    watch,
    trigger,
  } = methods;

  // Add watcher for form values
  const formValues = watch();
  
  // Watch password to trigger confirm password validation
  const password = watch('password');
  useEffect(() => {
    if (formValues.confirmPassword) {
      trigger('confirmPassword');
    }
  }, [password, trigger]);

  useEffect(() => {
    // Clear any previous errors when component mounts
    clearError();
    setLocalError(null);
  }, [clearError]);

  const onSubmit = async (data: FormValuesProps) => {
    console.log('Form submitted with data:', data);
    console.log('Form validation state:', {
      isValid,
      errors,
      isSubmitting,
      isLoading
    });

    try {
      setLocalError(null);
      setShowNotification(false);
      
      console.log('Attempting to register user...');
      // Register the user
      await registerUser(data.name, data.email, data.password);
      console.log('Registration successful');
      
      // Show success message
      setIsSuccess(true);
      setShowNotification(true);
      
      // Reset form
      reset();
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        console.log('Redirecting to login page...');
        router.push('/auth/login-illustration');
      }, 2000);
      
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Unable to register. Please try again.';
      
      if (error instanceof Error) {
        try {
          const errorData = JSON.parse(error.message);
          console.log('Parsed error data:', errorData);
          if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.email) {
            errorMessage = 'This email is already registered';
          } else if (errorData.password) {
            errorMessage = 'Password does not meet requirements';
          }
        } catch {
          if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Unable to connect to the server. Please check your internet connection.';
          }
        }
      }
      
      setLocalError(errorMessage);
      setShowNotification(true);
    }
  };

  // Add console log for form state changes
  useEffect(() => {
    console.log('Form state:', {
      isSubmitting,
      isValid,
      isLoading,
      error,
      localError,
      formValues,
      errors
    });
  }, [isSubmitting, isValid, isLoading, error, localError, formValues, errors]);

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

        <RHFTextField 
          name="name" 
          label="Full Name" 
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <RHFTextField 
          name="email" 
          label="Email address" 
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          error={!!errors.password}
          helperText={errors.password?.message}
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
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
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

        <Controller
          name="gender"
          control={methods.control}
          render={({ field }) => (
            <FormControl component="fieldset" error={!!errors.gender}>
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup
                row
                {...field}
                value={field.value || ''}
              >
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="female" control={<Radio />} label="Female" />
              </RadioGroup>
              {errors.gender && (
                <Typography color="error" variant="caption">
                  {errors.gender.message}
                </Typography>
              )}
            </FormControl>
          )}
        />

        <RHFTextField
          name="age"
          label="Age"
          type="number"
          error={!!errors.age}
          helperText={errors.age?.message}
          inputProps={{ min: 13, max: 120 }}
        />

        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting || isLoading}
          disabled={isSubmitting || isLoading || !isValid}
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

        {/* Note: Social sign-in options (Google, GitHub, Facebook) are intentionally not included */}
      </Stack>
    </FormProvider>
  );
}
