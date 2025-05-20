// next
import Head from 'next/head';
// layouts
import MainLayout from 'src/layouts/main';
// @mui
import {
  Container,
  Typography,
} from '@mui/material';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// store
import { useCartStore } from 'src/store/cart';
// routes
import { paths } from 'src/routes/paths';
//
import { EcommerceHeader } from '../../sections/_e-commerce/layout';
import { EcommerceCartList, EcommerceCartSummary } from '../../sections/_e-commerce/cart';

// ----------------------------------------------------------------------

EcommerceCartPage.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>;

// ----------------------------------------------------------------------

export default function EcommerceCartPage() {
  const settings = useSettingsContext();
  const { items } = useCartStore();

  return (
    <>
      <Head>
        <title>Cart | ConnectX</title>
      </Head>

      <EcommerceHeader />

      <Container
        sx={{
          overflow: 'hidden',
          pt: 5,
          pb: { xs: 5, md: 10 },
        }}
      >
        <CustomBreadcrumbs
          links={[
            { name: 'Home', href: '/' },
            { name: 'Products', href: paths.eCommerce.products },
            { name: 'Cart' },
          ]}
          sx={{ mb: 5 }}
        />

        <Typography variant="h3" sx={{ mb: 5 }}>
          Cart
        </Typography>

        <EcommerceCartList
          products={items}
          onDelete={() => {}}
          onDecreaseQuantity={() => {}}
          onIncreaseQuantity={() => {}}
        />

        <EcommerceCartSummary
          sx={{
            mt: 5,
            p: 5,
            borderRadius: 2,
            bgcolor: 'background.neutral',
          }}
        />
      </Container>
    </>
  );
}
