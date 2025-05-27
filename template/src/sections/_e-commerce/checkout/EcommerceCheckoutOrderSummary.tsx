// @mui
import { alpha } from '@mui/material/styles';
import {
  Box,
  Stack,
  Divider,
  Typography,
  StackProps,
  IconButton,
  Card,
  Button,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// utils
import { fCurrency } from 'src/utils/currency';
// types
import { CartItem } from 'src/store/cart';
// components
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import TextMaxLine from 'src/components/text-max-line';
// store
import { useCartStore } from 'src/store/cart';
import { useAuthStore } from 'src/store/auth';

// ----------------------------------------------------------------------

interface EcommerceCheckoutOrderSummaryProps {
  tax: number;
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  products: CartItem[];
  loading?: boolean;
  onPlaceOrder?: () => void;
}

export default function EcommerceCheckoutOrderSummary({
  tax,
  total,
  subtotal,
  shipping,
  discount,
  products,
  loading,
  onPlaceOrder,
}: EcommerceCheckoutOrderSummaryProps) {
  const { removeItem } = useCartStore();
  const { user } = useAuthStore();

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Order Summary
      </Typography>

      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Subtotal
          </Typography>
          <Typography variant="subtitle2">${subtotal}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Shipping
          </Typography>
          <Typography variant="subtitle2">${shipping}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Tax
          </Typography>
          <Typography variant="subtitle2">${tax}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Discount
          </Typography>
          <Typography variant="subtitle2">-${discount}</Typography>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="subtitle1">Total</Typography>
          <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
            ${total}
          </Typography>
        </Stack>

        <Button
          size="large"
          variant="contained"
          color="primary"
          disabled={loading}
          onClick={onPlaceOrder}
        >
          Place Order
        </Button>
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

type ProductItemProps = StackProps & {
  product: any;
  onRemove: () => void;
};

function ProductItem({ product, onRemove, ...other }: ProductItemProps) {
  return (
    <Stack direction="row" alignItems="flex-start" {...other}>
      <Image
        src={product.cover_url}
        sx={{
          mr: 2,
          width: 64,
          height: 64,
          flexShrink: 0,
          borderRadius: 1.5,
          bgcolor: 'background.neutral',
        }}
      />

      <Stack flexGrow={1}>
        <TextMaxLine variant="body2" line={1} sx={{ fontWeight: 'fontWeightMedium' }}>
          {product.name}
        </TextMaxLine>

        <Typography variant="subtitle2" sx={{ mt: 0.5, mb: 1.5 }}>
          {fCurrency(product.price)}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Qty: {product.quantity}
        </Typography>
      </Stack>

      <IconButton onClick={onRemove}>
        <Iconify icon="carbon:trash-can" />
      </IconButton>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type RowProps = StackProps & {
  label: string;
  value: string;
};

function Row({ label, value, sx, ...other }: RowProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ typography: 'subtitle2', ...sx }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'body2' }}>
        {label}
      </Box>
      {value}
    </Stack>
  );
}
