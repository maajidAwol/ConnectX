import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
// @mui
import { Container, Unstable_Grid2 as Grid, Typography, Stack, Button } from '@mui/material';
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import LoadingScreen from 'src/components/loading-screen';
import Iconify from 'src/components/iconify';
// store
import { useProductStore } from 'src/store/product';
import { useAuthStore } from 'src/store/auth';
//
import ReviewEcommerce from '../../review/e-commerce';
import {
  EcommerceProductDetailsInfo,
  EcommerceProductDetailsCarousel,
  EcommerceProductDetailsDescription,
} from '../product/details';

// ----------------------------------------------------------------------

export default function EcommerceProductView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');

  const { currentProduct, loading, error, fetchProductById } = useProductStore();

  useEffect(() => {
    if (productId) {
      fetchProductById(productId);
    }
  }, [fetchProductById, productId]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <Container>
        <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ minHeight: '50vh' }}>
          <Typography color="error" variant="h6">
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.back()}
            startIcon={<Iconify icon="carbon:arrow-left" />}
          >
            Go Back
          </Button>
        </Stack>
      </Container>
    );
  }

  if (!currentProduct) {
    return (
      <Container>
        <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ minHeight: '50vh' }}>
          <Typography variant="h6">Product not found</Typography>
          <Button
            variant="contained"
            onClick={() => router.back()}
            startIcon={<Iconify icon="carbon:arrow-left" />}
          >
            Go Back
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <>
      {/* <EcommerceHeader /> */}

      <Container sx={{ overflow: 'hidden' }}>
        <CustomBreadcrumbs
          links={[
            { name: 'Home' },
            { name: currentProduct.category.name },
            { name: currentProduct.name },
          ]}
          sx={{ my: 5 }}
        />

        <Grid container spacing={{ xs: 5, md: 8 }}>
          <Grid xs={12} md={6} lg={7}>
            <EcommerceProductDetailsCarousel images={[currentProduct.cover_url, ...currentProduct.images]} />
          </Grid>

          <Grid xs={12} md={6} lg={5}>
            <EcommerceProductDetailsInfo
              name={currentProduct.name}
              price={Number(currentProduct.base_price)}
              rating={currentProduct.review.average_rating}
              review={currentProduct.review}
              priceSale={Number(currentProduct.selling_price) || 0}
              caption={currentProduct.short_description}
              inStock={currentProduct.quantity}
              colors={currentProduct.colors}
            />
          </Grid>
        </Grid>

        <Grid container columnSpacing={{ md: 8 }}>
          <Grid xs={12} md={6} lg={7}>
            <EcommerceProductDetailsDescription
              description={currentProduct.description}
              specifications={[
                { label: 'Category', value: currentProduct.category.name },
                { label: 'Brand', value: currentProduct.brand || 'N/A' },
                { label: 'Warranty', value: currentProduct.warranty || 'N/A' },
                { label: 'SKU', value: currentProduct.sku },
                { label: 'Stock', value: `${currentProduct.quantity} units` },
              ]}
            />
          </Grid>
        </Grid>
      </Container>

      <ReviewEcommerce />
    </>
  );
}
