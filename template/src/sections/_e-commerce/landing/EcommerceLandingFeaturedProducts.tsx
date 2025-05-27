// @mui
import { Box, Typography, Container, Unstable_Grid2 as Grid } from '@mui/material';
// store
import { useProductStore } from 'src/store/product';
import { useEffect } from 'react';
//
import { EcommerceProductItemHot, EcommerceProductItemCountDown } from '../product/item';
import { EcommerceProductList } from '../product/list';

// ----------------------------------------------------------------------

export default function EcommerceLandingFeaturedProducts() {
  const { featuredProducts, loading, fetchFeaturedProducts } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  if (loading || !featuredProducts || featuredProducts.length === 0) {
    return null;
  }

  const mappedProducts = featuredProducts.map((product) => ({
    id: product.id,
    tenant: product.tenant || [],
    owner: product.owner || '',
    sku: product.sku || '',
    name: product.name,
    base_price: product.base_price,
    profit_percentage: product.profit_percentage || null,
    selling_price: product.selling_price ? parseFloat(product.selling_price) : null,
    quantity: product.quantity,
    category: product.category,
    is_public: product.is_public || false,
    description: product.description,
    short_description: product.short_description,
    tag: product.tag || [],
    brand: product.brand || '',
    additional_info: product.additional_info || {},
    warranty: product.warranty || '',
    cover_url: product.cover_url,
    images: product.images || [],
    colors: product.colors || [],
    sizes: product.sizes || [],
    total_sold: product.total_sold,
    total_ratings: product.review?.rating_distribution?.['5'] || 0,
    total_reviews: product.review?.total_reviews || 0,
    created_at: product.created_at,
    updated_at: product.updated_at
  }));

  return (
    <Container>
      <Typography variant="h3" sx={{ mb: 8, textAlign: 'center' }}>
        Featured Products
      </Typography>

      <EcommerceProductList
        products={mappedProducts}
        loading={loading}
        viewMode="grid"
      />
    </Container>
  );
}
