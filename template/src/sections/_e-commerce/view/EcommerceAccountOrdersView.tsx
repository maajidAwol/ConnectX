import { useState, useEffect } from 'react';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
import {
  Box,
  Tab,
  Tabs,
  Table,
  Stack,
  Switch,
  TableRow,
  TableBody,
  TableCell,
  TextField,
  Typography,
  TableContainer,
  InputAdornment,
  TablePagination,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import Label from 'src/components/label';
// utils
import { fDate } from 'src/utils/formatTime';
import { fCurrency } from 'src/utils/formatNumber';
// store
import { useAuthStore } from 'src/store/auth';
// api
import { apiRequest } from 'src/lib/api-config';
//
import { EcommerceAccountLayout } from '../layout';
import {
  stableSort,
  getComparator,
  EcommerceAccountOrdersTableHead,
} from '../account/orders';

// ----------------------------------------------------------------------

interface Order {
  id: string;
  order_number: string;
  seller_tenant_name: string;
  status: string;
  total_amount: string;
  created_at: string;
  items_count: number;
  total_quantity: number;
  first_item: {
    product_name: string;
    product_id: string;
    cover_url: string;
  };
  payment_status: {
    display_status: string;
    method: string;
  };
}

interface OrdersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Order[];
}

const TABS = [
  'All Orders',
  'Pending',
  'Processing',
  'Confirmed',
  'Shipped',
  'Delivered',
  'Cancelled',
  'Refunded',
  'Failed',
];

export const TABLE_HEAD = [
  { id: 'order_number', label: 'Order ID' },
  { id: 'first_item', label: 'Item' },
  { id: 'created_at', label: 'Order Date', width: 160 },
  { id: 'total_amount', label: 'Price', width: 100 },
  { id: 'status', label: 'Status', width: 100 },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function EcommerceAccountOrdersPage() {
  const { accessToken } = useAuthStore();
  const [tab, setTab] = useState('All Orders');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [orderBy, setOrderBy] = useState('created_at');
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [page, rowsPerPage, tab, searchQuery]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const status = tab === 'All Orders' ? '' : tab.toLowerCase();
      const response = await apiRequest<OrdersResponse>(`/orders/my-orders/?page=${page + 1}&page_size=${rowsPerPage}&status=${status}&search=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response) {
        setOrders(response.results);
        setTotalCount(response.count);
      }
    } catch (error) {
      // Silent error handling
    } finally {
      setLoading(false);
    }
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
    setPage(0);
  };

  const handleSort = (id: string) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    } else {
      setOrder('desc');
      setOrderBy('created_at');
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'cancelled':
        return 'error';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'refunded':
        return 'secondary';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <EcommerceAccountLayout>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Orders
      </Typography>

      <Tabs
        value={tab}
        scrollButtons="auto"
        variant="scrollable"
        allowScrollButtonsMobile
        onChange={handleChangeTab}
      >
        {TABS.map((category) => (
          <Tab key={category} value={category} label={category} />
        ))}
      </Tabs>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 5, mb: 3 }}>
        <TextField
          fullWidth
          hiddenLabel
          placeholder="Search orders..."
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="carbon:search" width={24} sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <TableContainer
        sx={{
          overflow: 'unset',
          '& .MuiTableCell-head': {
            color: 'text.primary',
          },
          '& .MuiTableCell-root': {
            bgcolor: 'background.default',
            borderBottomColor: (theme) => theme.palette.divider,
          },
        }}
      >
        <Scrollbar>
          <Table
            sx={{
              minWidth: 720,
            }}
            size={dense ? 'small' : 'medium'}
          >
            <EcommerceAccountOrdersTableHead
              order={order}
              orderBy={orderBy}
              onSort={handleSort}
              headCells={TABLE_HEAD}
            />

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      No orders found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                stableSort(orders, getComparator(order, orderBy)).map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                  >
                    <TableCell>{row.order_number}</TableCell>

                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Box
                          component="img"
                          src={row.first_item?.cover_url || '/assets/images/placeholder.svg'}
                          alt={row.first_item?.product_name || 'Product'}
                          sx={{ 
                            width: 48, 
                            height: 48, 
                            borderRadius: 1,
                            objectFit: 'cover',
                            bgcolor: 'background.neutral'
                          }}
                        />
                        <Box>
                          <Typography variant="body2">
                            {row.first_item?.product_name || 'Product'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {row.items_count} {row.items_count === 1 ? 'item' : 'items'}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>{fDate(row.created_at)}</TableCell>

                    <TableCell>{fCurrency(parseFloat(row.total_amount))}</TableCell>

                    <TableCell>
                      <Label color={getStatusColor(row.status)}>
                        {row.status}
                      </Label>
                    </TableCell>

                    <TableCell align="right">
                      <Iconify icon="carbon:overflow-menu-vertical" />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <Box sx={{ position: 'relative' }}>
        <TablePagination
          page={page}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense padding"
          sx={{
            pl: 2,
            py: 1.5,
            top: 0,
            position: {
              sm: 'absolute',
            },
          }}
        />
      </Box>
    </EcommerceAccountLayout>
  );
}
