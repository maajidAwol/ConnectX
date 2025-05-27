import { useEffect } from 'react';
// @mui
import {
  Box,
  Stack,
  Rating,
  Button,
  Container,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';
// utils
import { fShortenNumber } from 'src/utils/formatNumber';
// components
import Iconify from 'src/components/iconify';
// store
import { useReviewStore } from 'src/store/review';
//
import { ReviewProgress } from '../components';

// ----------------------------------------------------------------------

type Props = {
  productId: string;
  onOpenForm: VoidFunction;
};

export default function ReviewSummary({ productId, onOpenForm }: Props) {
  const { productReviews, fetchProductReviews } = useReviewStore();

  useEffect(() => {
    if (productId) {
      fetchProductReviews(productId);
    }
  }, [productId, fetchProductReviews]);

  const totalReviews = productReviews.length;
  const averageRating = productReviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews || 0;

  const ratingDistribution = {
    '5': productReviews.filter(review => review.rating === 5).length,
    '4': productReviews.filter(review => review.rating === 4).length,
    '3': productReviews.filter(review => review.rating === 3).length,
    '2': productReviews.filter(review => review.rating === 2).length,
    '1': productReviews.filter(review => review.rating === 1).length,
  };

  return (
    <Box
      sx={{
        overflow: 'hidden',
        bgcolor: 'background.neutral',
        py: { xs: 8, md: 10 },
      }}
    >
      <Container>
        <Grid container spacing={{ xs: 5, md: 8 }}>
          <Grid xs={12} md={4}>
            <Typography variant="h3">Reviews</Typography>

            <Stack spacing={2} direction="row" alignItems="center" sx={{ my: 3 }}>
              <Typography variant="h2"> {averageRating.toFixed(1)}</Typography>

              <Stack spacing={0.5}>
                <Rating
                  value={averageRating}
                  readOnly
                  precision={0.1}
                  sx={{
                    '& svg': {
                      color: 'text.primary',
                    },
                  }}
                />
                <Typography variant="body2">{fShortenNumber(totalReviews)} reviews</Typography>
              </Stack>
            </Stack>

            <Button
              size="large"
              variant="contained"
              startIcon={<Iconify icon="carbon:edit" />}
              onClick={onOpenForm}
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              Write a Review
            </Button>
          </Grid>

          <Grid xs={12} md={4}>
            <ReviewProgress ratingDistribution={ratingDistribution} totalReviews={totalReviews} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
