// @mui
import { Box, Typography, Container, Unstable_Grid2 as Grid } from '@mui/material';
// store
import { useProductStore } from 'src/store/product';
import { useEffect } from 'react';
//
import { EcommerceProductItemHot, EcommerceProductItemCountDown } from '../product/item';

// ----------------------------------------------------------------------

export default function EcommerceLandingFeaturedProducts() {
  const { featuredProducts, loading, fetchFeaturedProducts } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  if (loading || featuredProducts.length === 0) {
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
    <Container
      sx={{
        py: { xs: 5, md: 8 },
      }}
    >
      <Typography
        variant="h3"
        sx={{
          mb: 8,
          textAlign: { xs: 'center', md: 'unset' },
        }}
      >
        Featured Products
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} lg={8}>
          <Box
            gap={3}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
          >
            {featuredProducts.slice(0, 2).map((product, index) => (
              <EcommerceProductItemCountDown
                key={product.id}
                product={mapProductToProps(product)}
                color={index === 0 ? 'primary' : 'secondary'}
              />
            ))}
          </Box>
        </Grid>

        <Grid xs={12} lg={4}>
          <Box
            gap={3}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
              lg: 'repeat(2, 1fr)',
            }}
          >
            {featuredProducts.slice(2, 6).map((product) => (
              <EcommerceProductItemHot
                key={product.id}
                product={mapProductToProps(product)}
              />
            ))}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
