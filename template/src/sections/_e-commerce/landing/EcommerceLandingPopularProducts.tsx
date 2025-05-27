import { useState, useEffect } from 'react';
// @mui
import { Box, Typography, Container, Tabs, Tab, Unstable_Grid2 as Grid } from '@mui/material';
// _mock
import { _products } from 'src/_mock';
// store
import { useProductStore } from 'src/store/product';
//
import { EcommerceProductItemBestSellers, EcommerceProductItemHot, EcommerceProductItemCountDown } from '../product/item';
import { EcommerceProductList } from '../product/list';

// ----------------------------------------------------------------------

const TABS = ['Featured Products', 'Top Rated Products', 'Onsale Products'];

// ----------------------------------------------------------------------

export default function EcommerceLandingPopularProducts() {
  const { featuredProducts, loading, fetchFeaturedProducts } = useProductStore();
  const [tab, setTab] = useState('Featured Products');

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  if (loading || !featuredProducts || featuredProducts.length === 0) {
    return null;
  }

  // Limit to 5 products
  const limitedProducts = featuredProducts.slice(0, 5);

  const mappedProducts = limitedProducts.map((product) => ({
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

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  return (
    <Container
      sx={{
        py: { xs: 5, md: 8 },
      }}
    >
      <Typography
        variant="h3"
        sx={{
          textAlign: { xs: 'center', md: 'unset' },
        }}
      >
        Popular Products
      </Typography>

      <Tabs
        value={tab}
        scrollButtons="auto"
        variant="scrollable"
        allowScrollButtonsMobile
        onChange={handleChangeTab}
        sx={{ my: 5 }}
      >
        {TABS.map((category) => (
          <Tab key={category} value={category} label={category} />
        ))}
      </Tabs>

      <EcommerceProductList
        products={mappedProducts}
        loading={loading}
        viewMode="grid"
      />
    </Container>
  );
}
