// next
import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
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
import { useAuthStore } from 'src/store/auth';
// routes
import { paths } from 'src/routes/paths';
//
import EcommerceCartView from 'src/sections/_e-commerce/view/EcommerceCartView';

// ----------------------------------------------------------------------

EcommerceCartPage.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>;

// ----------------------------------------------------------------------

export default function EcommerceCartPage() {
  const { items } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login-illustration?message=Please login to view your cart');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <>
      <Head>
        <title>Cart | ConnectX</title>
      </Head>

      <EcommerceCartView products={items} />
    </>
  );
}
