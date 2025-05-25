// next
import NextLink from 'next/link';
// @mui
import { Container, Typography, Button, Unstable_Grid2 as Grid } from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _products } from 'src/_mock';
// components
import Iconify from 'src/components/iconify';
// types
import { IProductItemProps } from 'src/types/product';
//
import { EcommerceCartList, EcommerceCartSummary, EcommerceCartItem } from '../cart';
import { CartItem } from 'src/store/cart';
import { useCartStore } from 'src/store/cart';

// ----------------------------------------------------------------------

type Props = {
  products: CartItem[];
};

export default function EcommerceCartView({ products }: Props) {
  const { getTotalPrice } = useCartStore();
  const subtotal = getTotalPrice();
  const shipping = 50;
  const tax = 0;
  const discount = 0;
  const total = subtotal + shipping + tax - discount;

  return (
    <>
      {/* <EcommerceHeader /> */}

      <Container
        sx={{
          overflow: 'hidden',
          pt: 5,
          pb: { xs: 5, md: 10 },
        }}
      >
        <Typography variant="h3" sx={{ mb: 5 }}>
          Shopping Cart
        </Typography>

        <Grid container spacing={{ xs: 5, md: 8 }}>
          <Grid xs={12} md={8}>
            <EcommerceCartList products={products} />
          </Grid>

          <Grid xs={12} md={4}>
            <EcommerceCartSummary
              tax={tax}
              total={total}
              subtotal={subtotal}
              shipping={shipping}
              discount={discount}
            />
          </Grid>
        </Grid>

        <Button
          component={NextLink}
          href={paths.eCommerce.products}
          color="inherit"
          startIcon={<Iconify icon="carbon:chevron-left" />}
          sx={{ mt: 3 }}
        >
          Continue Shopping
        </Button>
      </Container>
    </>
  );
}
