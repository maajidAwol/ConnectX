// next
import NextLink from 'next/link';
// @mui
import { Box, Container, Typography, Button, Stack } from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _products } from 'src/_mock';
// components
import Iconify from 'src/components/iconify';
// types
import { IProductItemProps } from 'src/types/product';
//
import { EcommerceCartList, EcommerceCartItem } from '../cart';

// ----------------------------------------------------------------------

type Props = {
  products: IProductItemProps[];
  onDelete?: (id: string) => void;
};

export default function EcommerceWishlistView({ products, onDelete }: Props) {
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
          Wishlist
        </Typography>

        {products.map((product) => (
          <EcommerceCartItem
            key={product.id}
            product={product}
            wishlist
            onDelete={() => onDelete?.(product.id)}
          />
        ))}

        <Stack
          direction={{ xs: 'column-reverse', sm: 'row' }}
          alignItems={{ sm: 'center' }}
          justifyContent={{ sm: 'space-between' }}
          sx={{ mt: 3 }}
        >
          <Button
            component={NextLink}
            href={paths.eCommerce.product}
            color="inherit"
            startIcon={<Iconify icon="carbon:chevron-left" />}
            sx={{ mt: 3 }}
          >
            Continue Shopping
          </Button>

          <Stack spacing={3} sx={{ minWidth: 240 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ typography: 'h6' }}
            >
              <Box component="span"> Subtotal</Box>
              $58.07
            </Stack>

            <Button
              component={NextLink}
              href={paths.eCommerce.cart}
              size="large"
              color="inherit"
              variant="contained"
              startIcon={<Iconify icon="carbon:shopping-cart-plus" />}
            >
              Add to Cart
            </Button>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
