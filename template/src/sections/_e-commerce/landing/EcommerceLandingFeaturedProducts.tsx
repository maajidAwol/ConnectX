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

  const mapProductToProps = (product: any) => ({
    id: product.id,
    name: product.name,
    coverImg: product.cover_url,
    price: parseFloat(product.base_price),
    priceSale: product.selling_price || null,
    sold: product.total_sold,
    inStock: product.quantity,
    rating: product.total_ratings,
    category: product.category.name,
    caption: product.short_description,
    description: product.description,
    review: product.total_reviews,
    images: product.images,
    label: product.tag[0] || '',
  });

  return (
    <Container>
      <Typography variant="h3" sx={{ mb: 8, textAlign: 'center' }}>
        Featured Products
      </Typography>

      <EcommerceProductList
        products={featuredProducts}
        loading={loading}
        viewMode="grid"
      />
    </Container>
  );
}
