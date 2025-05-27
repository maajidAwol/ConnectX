import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Stack,
  Button,
  Rating,
  Dialog,
  Typography,
  DialogProps,
  DialogTitle,
  DialogActions,
  DialogContent,
  FormHelperText,
  Alert,
} from '@mui/material';
// components
import FormProvider, { RHFTextField } from 'src/components/hook-form';
// store
import { useReviewStore } from 'src/store/review';
import { useAuthStore } from 'src/store/auth';
import { useState } from 'react';

// ----------------------------------------------------------------------

type FormValuesProps = {
  rating: number | null;
  comment: string;
};

interface Props extends DialogProps {
  onClose: VoidFunction;
  productId?: string;
}

// ----------------------------------------------------------------------

export default function ReviewNewForm({ onClose, productId: propProductId, ...other }: Props) {
  const { createReview, fetchProductReviews } = useReviewStore();
  const { user } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  // Get product ID from props or URL query
  const productId = propProductId || (router.query.id as string);

  const defaultValues = {
    rating: null,
    comment: '',
  };

  const NewReviewSchema = Yup.object().shape({
    rating: Yup.mixed().required('Rating is required'),
    comment: Yup.string().required('Review is required'),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewReviewSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      setError(null);
      if (!user) {
        throw new Error('User not authenticated');
      }

      if (!productId) {
        throw new Error('Product ID is required');
      }

      // Ensure rating is a number
      const rating = Number(data.rating);
      if (isNaN(rating) || rating < 1 || rating > 5) {
        throw new Error('Please provide a valid rating between 1 and 5');
      }

      await createReview({
        tenant: user.tenant,
        product: productId,
        user: user.id,
        rating,
        comment: data.comment,
        is_purchased: true,
        user_name: '',
        user_email: ''
      });

      // Refresh the reviews after successful submission
      await fetchProductReviews(productId);

      reset();
      onClose();
    } catch (error: any) {
      setError(error.message || 'Failed to create review. Please try again.');
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" onClose={onClose} {...other}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ typography: 'h3', pb: 3 }}>Write a Review</DialogTitle>

        <DialogContent sx={{ py: 0 }}>
          <Stack spacing={2.5}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <div>
              <Typography variant="subtitle2" gutterBottom>
                Your rating:
              </Typography>

              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <Rating
                    {...field}
                    value={Number(field.value)}
                    onChange={(_, newValue) => {
                      field.onChange(newValue);
                    }}
                  />
                )}
              />

              {!!errors.rating && <FormHelperText error> {errors.rating?.message}</FormHelperText>}
            </div>

            <RHFTextField multiline rows={3} name="comment" label="Review *" />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose} color="inherit">
            Cancel
          </Button>

          <LoadingButton color="inherit" type="submit" variant="contained" loading={isSubmitting}>
            Post Review
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
