import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Button,
  Stack,
} from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
// store
import { useCartStore } from 'src/store/cart';

// ----------------------------------------------------------------------

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { clearCart } = useCartStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clear cart and session storage
    clearCart();
    sessionStorage.removeItem('pendingOrder');
    
    // Set a timeout to redirect to order completed page
    const timer = setTimeout(() => {
      router.push(paths.eCommerce.orderCompleted);
    }, 5000); // Increased to 5 seconds

    setLoading(false);

    return () => clearTimeout(timer);
  }, [router, clearCart]);

  const handleContinue = () => {
    router.push(paths.eCommerce.orderCompleted);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Box
        sx={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
        }}
      >
        {loading ? (
          <>
            <CircularProgress />
            <Typography variant="h5">
              Processing your payment...
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h4" color="success.main">
              Payment Successful!
            </Typography>
            <Stack spacing={2}>
              <Typography variant="body1">
                Your order has been placed successfully.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                The merchant will process your order shortly. You can track your order status in your account.
              </Typography>
            </Stack>
            <Button 
              variant="contained" 
              onClick={handleContinue}
              sx={{ mt: 2 }}
            >
              View Order Details
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
} 