import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Stack,
  Typography,
  Grid,
  Chip,
  Button,
  IconButton,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
} from '@mui/material';
import { useAuthStore } from 'src/store/auth';
import { apiRequest } from 'src/lib/api-config';
import Iconify from 'src/components/iconify';
import { fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

interface OrderItem {
  product_name: string;
  product_id: string;
  cover_url: string;
  quantity: number;
  price: string;
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
  payment_status: string;
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

  const renderOrderList = () => (
    <Card sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        My Orders
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Total Amount</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order.id}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => handleViewOrder(order)}
              >
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      component="img"
                      src={order.first_item.cover_url}
                      sx={{
                        width: 60,
                        height: 60,
                        objectFit: 'cover',
                        borderRadius: 1,
                      }}
                    />
                    <Stack>
                      <Typography variant="subtitle2">
                        {order.first_item.product_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Order #{order.order_number}
                      </Typography>
                    </Stack>
                  </Stack>
                </TableCell>
                <TableCell>{fDateTime(order.created_at)}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle2" color="primary">
                    {fCurrency(parseFloat(order.total_amount))}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small">
                    <Iconify icon="eva:eye-fill" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );

  const renderOrderDetails = () => (
    <Card sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h5">Order Details</Typography>
        <Button
          variant="outlined"
          startIcon={<Iconify icon="eva:arrow-back-fill" />}
          onClick={() => setSelectedOrder(null)}
        >
          Back to Orders
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%', bgcolor: 'background.neutral' }}>
            <Typography variant="h6" gutterBottom>
              Order Information
            </Typography>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Order Number
                </Typography>
                <Typography variant="subtitle2">{selectedOrder?.order_number}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Date
                </Typography>
                <Typography variant="subtitle2">
                  {fDateTime(selectedOrder?.created_at || '')}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={selectedOrder?.status}
                  color={getStatusColor(selectedOrder?.status || '') as any}
                  size="small"
                />
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Total Amount
                </Typography>
                <Typography variant="subtitle2" color="primary.main">
                  {fCurrency(parseFloat(selectedOrder?.total_amount || '0'))}
                </Typography>
              </Stack>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%', bgcolor: 'background.neutral' }}>
            <Typography variant="h6" gutterBottom>
              Product Information
            </Typography>
            <Stack spacing={3}>
              <Box
                component="img"
                src={selectedOrder?.first_item.cover_url}
                sx={{
                  width: '100%',
                  height: 300,
                  borderRadius: 1,
                  objectFit: 'cover',
                }}
              />
              <Stack spacing={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {selectedOrder?.first_item.product_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Product ID: {selectedOrder?.first_item.product_id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quantity: {selectedOrder?.total_quantity}
                </Typography>
              </Stack>
            </Stack>
          </Card>
        </Grid>

        {selectedOrder?.status === 'pending' && (
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleCancelOrder(selectedOrder.id)}
                startIcon={<Iconify icon="eva:close-circle-fill" />}
              >
                Cancel Order
              </Button>
            </Stack>
          </Grid>
        )}
      </Grid>
    </Card>
  );

  return selectedOrder ? renderOrderDetails() : renderOrderList();
} 