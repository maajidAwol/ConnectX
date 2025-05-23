import { m } from 'framer-motion';
import { useEffect, useState } from 'react';
// next
import NextLink from 'next/link';
// @mui
import { Box, Button, Typography, Stack, Container, Card, Divider } from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import { MotionContainer, varBounce } from 'src/components/animate';
// utils
import { fCurrency } from 'src/utils/formatNumber';
// store
import { useAuthStore } from 'src/store/auth';
// api
import { apiRequest } from 'src/lib/api-config';
//
// import { EcommerceHeader } from '../layout';

// ----------------------------------------------------------------------

interface OrderDetails {
  id: string;
  order_number: string;
  status: string;
  subtotal: string;
  shipping: string;
  total: string;
  created_at: string;
  items: Array<{
    product: {
      name: string;
      image: string;
    };
    quantity: number;
    price: string;
  }>;
}

export default function EcommerceOrderCompletedView() {
  const { accessToken } = useAuthStore();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const pendingOrder = sessionStorage.getItem('pendingOrder');
        if (pendingOrder) {
          const { orderId } = JSON.parse(pendingOrder);
          const response = await apiRequest(`/orders/${orderId}/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setOrderDetails(response as OrderDetails);
        }
      } catch (error) {
        // Silent error handling
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [accessToken]);

  if (loading) {
    return (
      <Container sx={{ py: 10, textAlign: 'center' }}>
        <Typography>Loading order details...</Typography>
      </Container>
    );
  }

  return (
    <>
      {/* <EcommerceHeader /> */}

      <Container
        component={MotionContainer}
        sx={{
          textAlign: 'center',
          pt: { xs: 5, md: 10 },
          pb: { xs: 10, md: 20 },
        }}
      >
        <m.div variants={varBounce().in}>
          <Box sx={{ fontSize: 128 }}>🎉</Box>
        </m.div>

        <Stack spacing={1} sx={{ my: 5 }}>
          <Typography variant="h3">Order Placed Successfully!</Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            The merchant will process your order shortly. You can track your order status in your account.
          </Typography>
        </Stack>

        {orderDetails && (
          <Card sx={{ p: 3, mb: 5, textAlign: 'left' }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Order Details
            </Typography>

            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Order Number
                </Typography>
                <Typography variant="subtitle2">{orderDetails.order_number}</Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Status
                </Typography>
                <Typography variant="subtitle2" sx={{ color: 'info.main' }}>
                  Pending Processing
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Date
                </Typography>
                <Typography variant="subtitle2">
                  {new Date(orderDetails.created_at).toLocaleDateString()}
                </Typography>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Items
              </Typography>

              {orderDetails.items.map((item, index) => (
                <Stack
                  key={index}
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{ py: 1 }}
                >
                  <Box
                    component="img"
                    src={item.product.image}
                    sx={{ width: 48, height: 48, borderRadius: 1 }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2">{item.product.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Quantity: {item.quantity}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle2">
                    {fCurrency(parseFloat(item.price))}
                  </Typography>
                </Stack>
              ))}

              <Divider sx={{ my: 2 }} />

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle1">Total</Typography>
                <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
                  {fCurrency(parseFloat(orderDetails.total))}
                </Typography>
              </Stack>
            </Stack>
          </Card>
        )}

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            component={NextLink}
            href={paths.eCommerce.products}
            size="large"
            color="inherit"
            variant="contained"
            startIcon={<Iconify icon="carbon:chevron-left" />}
          >
            Continue Shopping
          </Button>

          <Button
            component={NextLink}
            href={paths.eCommerce.account.orders}
            size="large"
            variant="contained"
            startIcon={<Iconify icon="carbon:document" />}
          >
            View All Orders
          </Button>
        </Stack>
      </Container>
    </>
  );
}
