import { useRef, useEffect } from 'react';
import { add } from 'date-fns';
// @mui
import { useTheme } from '@mui/material/styles';
import { Typography, Container, Stack, Box, Unstable_Grid2 as Grid } from '@mui/material';
// hooks
import useResponsive from 'src/hooks/useResponsive';
// store
import { useProductStore } from 'src/store/product';
// components
import Carousel, { CarouselDots, CarouselArrows } from 'src/components/carousel';
//
import { ProductCountdownBlock } from '../components';
import { EcommerceProductItemHot, EcommerceProductItemCountDown } from '../product/item';
import { EcommerceProductList } from '../product/list';

// ----------------------------------------------------------------------

export default function EcommerceLandingHotDealToday() {
  const theme = useTheme();
  const isMdUp = useResponsive('up', 'md');
  const carouselRef = useRef<Carousel | null>(null);
  const { featuredProducts, loading, fetchFeaturedProducts } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  const carouselSettings = {
    dots: true,
    arrows: false,
    slidesToShow: 6,
    slidesToScroll: 6,
    rtl: Boolean(theme.direction === 'rtl'),
    ...CarouselDots({
      sx: {
        mt: 8,
        ...(isMdUp && { display: 'none' }),
      },
    }),
    responsive: [
      {
        // Down md
        breakpoint: theme.breakpoints.values.md,
        settings: { slidesToShow: 3, slidesToScroll: 3 },
      },
      {
        // Down sm
        breakpoint: theme.breakpoints.values.sm,
        settings: { slidesToShow: 2, slidesToScroll: 2 },
      },
    ],
  };

  const handlePrev = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };

  if (loading || !featuredProducts || featuredProducts.length === 0) {
    return null;
  }

  // Get 3 random products
  const shuffled = [...featuredProducts].sort(() => 0.5 - Math.random());
  const randomProducts = shuffled.slice(0, 3);

  const mappedProducts = randomProducts.map((product) => ({
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
    <Container
      sx={{
        py: { xs: 5, md: 8 },
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems="center"
        spacing={3}
        sx={{
          mb: 8,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            textAlign: { xs: 'center', md: 'unset' },
          }}
        >
          🔥 Hot Deal Today
        </Typography>

        <ProductCountdownBlock
          hiddenLabel
          expired={add(new Date(), { hours: 1, minutes: 30 })}
          sx={{
            '& .value': {
              width: 36,
              height: 32,
              color: 'grey.800',
              bgcolor: 'text.primary',
              ...(theme.palette.mode === 'light' && {
                color: 'common.white',
              }),
            },
            '& .separator': { color: 'text.primary' },
          }}
        />

        {isMdUp && (
          <CarouselArrows
            onNext={handleNext}
            onPrev={handlePrev}
            flexGrow={1}
            spacing={2}
            justifyContent="flex-end"
          />
        )}
      </Stack>

      <EcommerceProductList
        products={mappedProducts}
        loading={loading}
        viewMode="grid"
      />
    </Container>
  );
}
