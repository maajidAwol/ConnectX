import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  Card,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Pagination,
  Container,
  Grid,
} from '@mui/material';
import { useAuthStore } from 'src/store/auth';
import { apiRequest } from 'src/lib/api-config';
import Iconify from 'src/components/iconify';
import { fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/formatNumber';

interface OrderItem {
  product_name: string;
  product_id: string;
  cover_url: string;
}

interface PaymentStatus {
  display_status: string;
  method: string;
}

interface Order {
  id: string;
  order_number: string;
  seller_tenant_id: string;
  seller_tenant_name: string;
  status: string;
  total_amount: string;
  created_at: string;
  items_count: number;
  total_quantity: number;
  first_item: OrderItem;
  payment_status: PaymentStatus;
}

export default function EcommerceAccountOrdersView() {
  const { accessToken } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      if (!accessToken) return;

      const response = await apiRequest<{ results: Order[]; count: number }>(`/orders/my-orders/?page=${page}&page_size=10`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || '',
          'Authorization': `Bearer ${accessToken}`
        }
      }, true, accessToken);

      if (response?.results) {
        setOrders(response.results);
        setTotalPages(Math.ceil(response.count / 10));
      }
    } catch (error) {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, accessToken]);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      if (!accessToken) return;

      await apiRequest(`/orders/${orderId}/cancel/`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || '',
          'Authorization': `Bearer ${accessToken}`
        }
      }, true, accessToken);

      fetchOrders();
    } catch (error) {
      // Handle error silently
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (selectedOrder) {
  return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Card sx={{ p: { xs: 2, md: 4 }, borderRadius: 2, boxShadow: (theme) => theme.customShadows?.z16 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
            <Typography variant="h4">Order Details</Typography>
            <Button
              variant="outlined"
              startIcon={<Iconify icon="eva:arrow-back-fill" />}
              onClick={() => setSelectedOrder(null)}
              sx={{ borderRadius: 2 }}
            >
              Back to Orders
            </Button>
          </Stack>

          <Grid container spacing={4}>
            {/* Order Information */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, height: '100%', bgcolor: 'background.neutral' }}>
                <Typography variant="h6" gutterBottom>
                  Order Information
                </Typography>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Order Number</Typography>
                    <Typography variant="subtitle2">{selectedOrder.order_number}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Date</Typography>
                    <Typography variant="subtitle2">{fDateTime(selectedOrder.created_at)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Status</Typography>
                    <Chip 
                      label={selectedOrder.status} 
                      color={getStatusColor(selectedOrder.status) as any}
                      size="small"
                    />
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Total Amount</Typography>
                    <Typography variant="subtitle2" color="primary.main">
                      {fCurrency(parseFloat(selectedOrder.total_amount))}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Payment Method</Typography>
                    <Typography variant="subtitle2">{selectedOrder.payment_status.method}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Items Count</Typography>
                    <Typography variant="subtitle2">{selectedOrder.items_count}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Total Quantity</Typography>
                    <Typography variant="subtitle2">{selectedOrder.total_quantity}</Typography>
                  </Stack>
                </Stack>
              </Card>
            </Grid>

            {/* Product Information */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, height: '100%', bgcolor: 'background.neutral' }}>
                <Typography variant="h6" gutterBottom>
                  Product Information
                </Typography>
                <Stack spacing={3}>
                  <Box
                    component="img"
                    src={selectedOrder.first_item.cover_url}
        sx={{
                      width: '100%',
                      height: 300,
                      borderRadius: 2,
                      objectFit: 'cover',
                      boxShadow: (theme) => theme.customShadows?.z8,
        }}
                  />
                  <Stack spacing={2}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {selectedOrder.first_item.product_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Product ID: {selectedOrder.first_item.product_id}
                    </Typography>
                  </Stack>
                </Stack>
              </Card>
            </Grid>

            {/* Action Buttons */}
            {selectedOrder.status === 'pending' && (
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleCancelOrder(selectedOrder.id)}
                    startIcon={<Iconify icon="eva:close-circle-fill" />}
                    sx={{ borderRadius: 2 }}
                  >
                    Cancel Order
                  </Button>
                </Stack>
              </Grid>
            )}
          </Grid>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Card sx={{ p: { xs: 2, md: 4 }, borderRadius: 2, boxShadow: (theme) => theme.customShadows?.z16 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          My Orders
        </Typography>

        <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order Number</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.order_number}</TableCell>
                  <TableCell>{fDateTime(order.created_at)}</TableCell>
                    <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">{fCurrency(parseFloat(order.total_amount))}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="View Details">
                        <IconButton 
                          onClick={() => handleViewOrder(order)}
                          sx={{ 
                            '&:hover': { 
                              bgcolor: 'primary.lighter',
                              color: 'primary.main'
                            }
                          }}
                        >
                          <Iconify icon="eva:eye-fill" />
                        </IconButton>
                      </Tooltip>
                      {order.status === 'pending' && (
                        <Tooltip title="Cancel Order">
                          <IconButton 
                            color="error"
                            onClick={() => handleCancelOrder(order.id)}
                            sx={{ 
                              '&:hover': { 
                                bgcolor: 'error.lighter',
                                color: 'error.main'
                              }
                            }}
                          >
                            <Iconify icon="eva:close-circle-fill" />
                          </IconButton>
                        </Tooltip>
                      )}
                      </Stack>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
      </TableContainer>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
          page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            shape="rounded"
          sx={{
              '& .MuiPaginationItem-root': {
                borderRadius: 1,
            },
          }}
        />
      </Box>
      </Card>
    </Container>
  );
}
