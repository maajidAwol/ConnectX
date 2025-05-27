// next
import NextLink from 'next/link';
// @mui
import { alpha } from '@mui/material/styles';
import {
  Box,
  Stack,
  Button,
  Divider,
  TextField,
  Typography,
  StackProps,
  InputAdornment,
} from '@mui/material';
// utils
import { fCurrency, fPercent } from 'src/utils/formatNumber';
// routes
import { paths } from 'src/routes/paths';
// store
import { useCartStore } from 'src/store/cart';

// ----------------------------------------------------------------------

type Props = StackProps & {
  tax?: number;
  total?: number;
  subtotal?: number;
  shipping?: number;
  discount?: number;
};

export default function EcommerceCartSummary({
  tax = 0,
  total = 0,
  subtotal = 0,
  shipping = 0,
  discount = 0,
  ...other
}: Props) {
  const { getTotalPrice } = useCartStore();

  return (
    <Stack
      spacing={3}
      sx={{
        p: 5,
        borderRadius: 2,
        border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.24)}`,
      }}
      {...other}
    >
      <Typography variant="h6"> Order Summary </Typography>

      <Stack spacing={2}>
        <Row label="Subtotal" value={fCurrency(getTotalPrice())} />
        <Row label="Shipping" value={fCurrency(50)} />
        {discount > 0 && (
          <Row label="Discount" value={`-${fCurrency(discount)}`} />
        )}
        {tax > 0 && (
          <Row label="Tax" value={fCurrency(tax)} />
        )}
      </Stack>

      <TextField
        hiddenLabel
        placeholder="Discount Code"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button>Apply</Button>
            </InputAdornment>
          ),
        }}
      />

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Row
        label="Total"
        value={fCurrency(getTotalPrice() + 50)}
        sx={{
          typography: 'h6',
          '& span': { typography: 'h6' },
        }}
      />

      <Button
        component={NextLink}
        href={paths.eCommerce.checkout}
        size="large"
        variant="contained"
        color="inherit"
      >
        Checkout
      </Button>
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
