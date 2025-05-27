import { useState } from 'react';
// @mui
import { Container } from '@mui/material';
// _mock
import { _reviews } from 'src/_mock';
//
import ReviewNewForm from '../components/ReviewNewForm';
import ReviewList from './ReviewList';
import ReviewSummary from './ReviewSummary';

// ----------------------------------------------------------------------

type Props = {
  productId: string;
};

export default function ReviewEcommerce({ productId }: Props) {
  const [openForm, setOpenForm] = useState(false);

  return (
    <>
      <ReviewSummary
        productId={productId}
        onOpenForm={() => setOpenForm(true)}
      />

      <Container>
        <ReviewList productId={productId} />
      </Container>

      <ReviewNewForm 
        open={openForm} 
        onClose={() => setOpenForm(false)} 
        productId={productId}
      />
    </>
  );
}
