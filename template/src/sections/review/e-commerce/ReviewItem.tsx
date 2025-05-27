// @mui
import { Stack, Rating, Button, Avatar, Typography, Box } from '@mui/material';
// utils
import { fDate } from 'src/utils/formatTime';
// types
import { Review } from 'src/store/review';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  review: Review;
  onHelpful?: (reviewId: string, isHelpful: boolean) => void;
};

export default function ReviewItem({ review, onHelpful }: Props) {
  const { id, rating, comment, created_at, user_name, user_email } = review;

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 1,
        bgcolor: 'background.neutral',
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar alt={user_name} src="/assets/images/avatar/avatar_default.jpg" />
          <Stack spacing={0.5}>
            <Typography variant="subtitle1" sx={{ color: 'primary.main' }}>{user_name}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {user_email}
            </Typography>
          </Stack>
        </Stack>

        <Stack spacing={1}>
          <Rating
            value={rating}
            precision={1}
            readOnly
            sx={{
              '& .MuiRating-iconFilled': {
                color: 'warning.main',
              },
              '& .MuiRating-iconEmpty': {
                color: 'grey.300',
              },
            }}
          />
          <Typography variant="body2">{comment}</Typography>
          {created_at && (
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              {fDate(created_at)}
            </Typography>
          )}
        </Stack>

        {onHelpful && (
          <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }}>
            <Typography variant="subtitle2">Was this review helpful?</Typography>

            <Stack direction="row" alignItems="center" spacing={1}>
              <Button 
                size="small" 
                color="inherit" 
                startIcon={<Iconify icon="carbon:thumbs-up" />}
                onClick={() => onHelpful(id, true)}
              >
                Yes
              </Button>

              <Button
                size="small"
                color="inherit"
                startIcon={
                  <Iconify
                    icon="carbon:thumbs-up"
                    sx={{
                      transform: 'scale(-1, -1)',
                    }}
                  />
                }
                onClick={() => onHelpful(id, false)}
              >
                No
              </Button>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
