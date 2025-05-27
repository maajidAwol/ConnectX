import { useEffect } from 'react';
// @mui
import { Box, Typography, Stack } from '@mui/material';
// store
import { useReviewStore } from 'src/store/review';
//
import ReviewItem from './ReviewItem';

// ----------------------------------------------------------------------

type Props = {
  productId?: string;
  onHelpful?: (reviewId: string, isHelpful: boolean) => void;
};

export default function ReviewList({ productId, onHelpful }: Props) {
  const { productReviews, loading, error, fetchProductReviews } = useReviewStore();

  useEffect(() => {
    
    if (productId) {
      fetchProductReviews(productId);
    } else {
    }
  }, [productId, fetchProductReviews]);

  

  if (!productId) {
    return null;
  }

  if (loading) {
    return <Box sx={{ py: 3 }}>Loading reviews...</Box>;
  }

  if (error) {
    return <Box sx={{ py: 3, color: 'error.main' }}>{error}</Box>;
  }

  if (!productReviews || productReviews.length === 0) {
    return (
      <Box sx={{ py: 3 }}>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          No reviews yet. Be the first to review this product!
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      {productReviews.map((review) => (
        <ReviewItem
          key={review.id}
          review={review}
          onHelpful={onHelpful}
        />
      ))}
    </Stack>
  );
}
