// @mui
import { alpha } from '@mui/material/styles';
import {
  Box,
  Stack,
  Divider,
  Typography,
  StackProps,
  IconButton,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// utils
import { fCurrency } from 'src/utils/formatNumber';
// components
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import TextMaxLine from 'src/components/text-max-line';
// store
import { useCartStore } from 'src/store/cart';
import { useAuthStore } from 'src/store/auth';

// ----------------------------------------------------------------------

type Props = {
  tax: number;
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  products?: any[];
  loading?: boolean;
};

export default function EcommerceCheckoutOrderSummary({
  tax,
  total,
  subtotal,
  shipping,
  discount,
  products,
  loading,
}: Props) {
  const { removeItem } = useCartStore();
  const { user } = useAuthStore();

  return (
    <Stack
      spacing={3}
      sx={{
        p: 5,
        borderRadius: 2,
        border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.24)}`,
      }}
    >
      <Typography variant="h6"> Order Summary </Typography>

      {user && (
        <Stack spacing={1}>
          <Typography variant="subtitle2">Customer Details</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {user.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {user.email}
          </Typography>
          {user.phone_number && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {user.phone_number}
            </Typography>
          )}
        </Stack>
      )}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {!!products?.length && (
        <>
          {products.map((product) => (
            <ProductItem 
              key={product.id} 
              product={product} 
              onRemove={() => removeItem(product.id)}
            />
          ))}

          <Divider sx={{ borderStyle: 'dashed' }} />
        </>
      )}

      <Stack spacing={2}>
        <Row label="Subtotal" value={fCurrency(subtotal)} />
        <Row label="Shipping" value={fCurrency(shipping)} />
        {discount > 0 && (
          <Row label="Discount" value={`-${fCurrency(discount)}`} />
        )}
        {tax > 0 && (
          <Row label="Tax" value={fCurrency(tax)} />
        )}
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Row
        label="Total"
        value={fCurrency(total)}
        sx={{
          typography: 'h6',
          '& span': { typography: 'h6' },
        }}
      />

      <LoadingButton
        size="large"
        variant="contained"
        color="inherit"
        type="submit"
        loading={loading}
      >
        Place Order
      </LoadingButton>
    </Stack>
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
