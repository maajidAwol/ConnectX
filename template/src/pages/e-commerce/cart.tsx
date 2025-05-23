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
import EcommerceCartView from 'src/sections/_e-commerce/view/EcommerceCartView';

// ----------------------------------------------------------------------

EcommerceCartPage.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>;

// ----------------------------------------------------------------------

export default function EcommerceCartPage() {
  const { items } = useCartStore();

  return (
    <>
      <Head>
        <title>Cart | ConnectX</title>
      </Head>

      <EcommerceCartView products={items} />
    </>
  );
}
