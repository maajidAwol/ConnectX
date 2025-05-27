import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
// layouts
import MainLayout from 'src/layouts/main';
// @mui
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Button,
  Stack,
  Card,
  Grid,
  Divider,
} from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
// store
import { useCartStore } from 'src/store/cart';
import { useAuthStore } from 'src/store/auth';
// api
import { apiRequest } from 'src/lib/api-config';
// utils
import { fCurrency } from 'src/utils/formatNumber';
import { fDateTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

PaymentSuccessPage.getLayout = (page: React.ReactElement) => (
  <MainLayout>{page}</MainLayout>
);

// ----------------------------------------------------------------------

interface OrderDetails {
  id: string;
  order_number: string;
  status: string;
  subtotal: string;
  shipping: string;
  total_amount: string;
  created_at: string;
  payment_status?: {
    display_status: string;
    method: string;
  };
  items: Array<{
    product: {
      name: string;
      image: string;
    };
    quantity: number;
    price: string;
  }>;
}

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { clearCart } = useCartStore();
  const { accessToken } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const pendingOrder = sessionStorage.getItem('pendingOrder');
        if (!pendingOrder) {
          setError('No pending order found');
          setLoading(false);
          return;
        }

        const { orderId } = JSON.parse(pendingOrder);
        if (!orderId) {
          setError('Invalid order ID');
          setLoading(false);
          return;
        }

        // Get the current auth state
        const { accessToken, refreshAccessToken } = useAuthStore.getState();
        
        if (!accessToken) {
          setError('Authentication required. Please log in again.');
          setLoading(false);
          return;
        }

        // Make the API request
        const response = await apiRequest(`/orders/${orderId}/`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }, true, accessToken);

        if (!response) {
          throw new Error('No response from server');
        }

        setOrderDetails(response as OrderDetails);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order details:', error);
        
        // Check if it's an authentication error
        if (error instanceof Error && error.message.includes('token_not_valid')) {
          try {
            const pendingOrder = sessionStorage.getItem('pendingOrder');
            if (!pendingOrder) {
              setError('No pending order found');
              setLoading(false);
              return;
            }

            const { orderId } = JSON.parse(pendingOrder);
            if (!orderId) {
              setError('Invalid order ID');
              setLoading(false);
              return;
            }

            // Try to refresh the token
            const newToken = await useAuthStore.getState().refreshAccessToken();
            
            if (newToken) {
              // Retry the request with the new token
              const retryResponse = await apiRequest(`/orders/${orderId}/`, {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${newToken}`,
                },
              }, true, newToken);

              if (retryResponse) {
                setOrderDetails(retryResponse as OrderDetails);
                setLoading(false);
                return;
              }
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
          }
        }
        
        setError('Failed to load order details. Please try again.');
        setLoading(false);
      }
    };

    fetchOrderDetails();
    clearCart();
  }, [clearCart]);

  const handleContinue = () => {
    sessionStorage.removeItem('pendingOrder');
    router.push(paths.eCommerce.account.orders);
  };

  const handleContinueShopping = () => {
    sessionStorage.removeItem('pendingOrder');
    router.push(paths.eCommerce.products);
  };

  if (loading) {
  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
        <Box sx={{ textAlign: 'center' }}>
            <CircularProgress />
          <Typography variant="h5" sx={{ mt: 2 }}>
            Loading order details...
            </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 10 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            {error}
              </Typography>
            <Button 
              variant="contained" 
              onClick={handleContinue}
              sx={{ mt: 2 }}
            >
            Continue to Order History
            </Button>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Head>
        <title>Payment Successful | ConnectX</title>
      </Head>

      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Stack spacing={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="success.main" gutterBottom>
              Payment Successful!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Your order has been placed successfully. Here are your order details:
            </Typography>
          </Box>

          {orderDetails && (
            <Card sx={{ p: { xs: 2, md: 3 } }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2, bgcolor: 'background.neutral' }}>
                    <Typography variant="h6" gutterBottom>
                      Order Information
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          Order Number
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {orderDetails.order_number}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          Date
                        </Typography>
                        <Typography variant="subtitle1">
                          {fDateTime(orderDetails.created_at)}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          Status
                        </Typography>
                        <Typography variant="subtitle1" color="info.main" sx={{ fontWeight: 600 }}>
                          {orderDetails.status}
                        </Typography>
                      </Box>

                      {orderDetails.payment_status && (
                        <>
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                              Payment Method
                            </Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {orderDetails.payment_status.method}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                              Payment Status
                            </Typography>
                            <Typography variant="subtitle1" color="success.main" sx={{ fontWeight: 600 }}>
                              {orderDetails.payment_status.display_status}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Stack>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2, bgcolor: 'background.neutral' }}>
                    <Typography variant="h6" gutterBottom>
                      Order Summary
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          Subtotal
                        </Typography>
                        <Typography variant="subtitle1">
                          {fCurrency(parseFloat(orderDetails.subtotal))}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          Shipping
                        </Typography>
                        <Typography variant="subtitle1">
                          {fCurrency(parseFloat(orderDetails.shipping))}
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 1 }} />

                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          Total Amount
                        </Typography>
                        <Typography variant="h6" color="primary.main" sx={{ fontWeight: 600 }}>
                          {fCurrency(parseFloat(orderDetails.total_amount))}
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card sx={{ p: 2, bgcolor: 'background.neutral' }}>
                    <Typography variant="h6" gutterBottom>
                      Order Items
                    </Typography>
                    <Stack spacing={2}>
                      {orderDetails.items.map((item, index) => (
                        <Card
                          key={index}
                          sx={{
                            p: 2,
                            bgcolor: 'background.paper',
                            '&:hover': {
                              bgcolor: 'action.hover',
                            },
                          }}
                        >
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Box
                              component="img"
                              src={item.product.image}
                              sx={{
                                width: { xs: 64, sm: 80 },
                                height: { xs: 64, sm: 80 },
                                borderRadius: 1,
                                objectFit: 'cover',
                              }}
                            />
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="subtitle1" sx={{ mb: 0.5, fontWeight: 600 }}>
                                {item.product.name}
                              </Typography>
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Typography variant="body2" color="text.secondary">
                                  Quantity: {item.quantity}
                                </Typography>
                                <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 600 }}>
                                  {fCurrency(parseFloat(item.price))}
                                </Typography>
                              </Stack>
                            </Box>
                          </Stack>
                        </Card>
                      ))}
                    </Stack>
                  </Card>
                </Grid>
              </Grid>
            </Card>
          )}

          <Box sx={{ textAlign: 'center' }}>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="outlined"
                size="large"
                onClick={handleContinueShopping}
                sx={{ minWidth: 200 }}
              >
                Continue Shopping
              </Button>
              <Button
                variant="contained"
                size="large"
                onClick={handleContinue}
                sx={{ minWidth: 200 }}
              >
                View Orders
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </>
  );
} 