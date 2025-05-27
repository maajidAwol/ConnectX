// @mui
import { Stack, RadioGroup, StackProps } from '@mui/material';
//
import ReviewProgressItem from './ReviewProgressItem';

// ----------------------------------------------------------------------

type RatingDistribution = {
  '5': number;
  '4': number;
  '3': number;
  '2': number;
  '1': number;
};

type Props = StackProps & {
  ratingDistribution: RatingDistribution;
  totalReviews: number;
};

// ----------------------------------------------------------------------

export default function ReviewProgress({ ratingDistribution, totalReviews, ...other }: Props) {
  const ratings = [
    { value: '5', number: ratingDistribution['5'] },
    { value: '4', number: ratingDistribution['4'] },
    { value: '3', number: ratingDistribution['3'] },
    { value: '2', number: ratingDistribution['2'] },
    { value: '1', number: ratingDistribution['1'] },
  ];

  return (
    <RadioGroup>
      <Stack spacing={2} {...other}>
        {ratings.map((rating, index) => (
          <ReviewProgressItem 
            key={rating.value} 
            rating={rating} 
            index={index} 
            totals={totalReviews} 
          />
        ))}
      </Stack>
    </RadioGroup>
  );
}
