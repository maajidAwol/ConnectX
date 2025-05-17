import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// @mui
import {
  Box,
  Stack,
  Button,
  Select,
  Divider,
  MenuItem,
  Container,
  Typography,
  FormControl,
  ToggleButton,
  SelectChangeEvent,
  ToggleButtonGroup,
} from '@mui/material';
// config
import { NAV } from 'src/config-global';
// components
import Iconify from 'src/components/iconify';
// store
import { useProductStore } from 'src/store/product';
import { useAuthStore } from 'src/store/auth';
//
import { EcommerceHeader } from '../layout';
import EcommerceFilters from '../product/filters';
import { EcommerceProductList, EcommerceProductListBestSellers } from '../product/list';

// ----------------------------------------------------------------------

const VIEW_OPTIONS = [
  { value: 'list', icon: <Iconify icon="carbon:list-boxes" /> },
  { value: 'grid', icon: <Iconify icon="carbon:grid" /> },
];

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'popular', label: 'Popular' },
];

// ----------------------------------------------------------------------

export default function EcommerceProductsView() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sort, setSort] = useState('latest');

  const router = useRouter();
  const { products, loading, error, fetchProducts } = useProductStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [fetchProducts, isAuthenticated]);

  const handleChangeViewMode = (event: React.MouseEvent<HTMLElement>, newMode: string | null) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleChangeSort = (event: SelectChangeEvent) => {
    setSort(event.target.value as string);
  };

  const handleMobileOpen = () => {
    setMobileOpen(true);
  };

  const handleMobileClose = () => {
    setMobileOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <Container>
        <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ minHeight: '50vh' }}>
          <Typography variant="h4">Please Login to View Products</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push('/auth/login')}
            startIcon={<Iconify icon="carbon:login" />}
          >
            Login
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <>
      <EcommerceHeader />

      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            py: 5,
          }}
        >
          <Typography variant="h3">Products</Typography>

          <Button
            color="inherit"
            variant="contained"
            startIcon={<Iconify icon="carbon:filter" width={18} />}
            onClick={handleMobileOpen}
            sx={{
              display: { md: 'none' },
            }}
          >
            Filters
          </Button>
        </Stack>

        <Stack
          direction={{
            xs: 'column-reverse',
            md: 'row',
          }}
          sx={{ mb: { xs: 8, md: 10 } }}
        >
          <Stack spacing={5} divider={<Divider sx={{ borderStyle: 'dashed' }} />}>
            <EcommerceFilters mobileOpen={mobileOpen} onMobileClose={handleMobileClose} />
            <EcommerceProductListBestSellers products={products.slice(0, 3).map(product => ({
              id: product.id,
              name: product.name,
              coverImg: product.cover_url,
              price: parseFloat(product.base_price),
              priceSale: product.selling_price || 0,
              sold: product.total_sold,
              rating: product.total_ratings,
              category: product.category.name,
              caption: product.short_description,
              description: product.description,
              inStock: product.quantity,
              review: product.total_reviews,
              images: product.images,
              label: product.tag[0] || '',
            }))} />
          </Stack>

          <Box
            sx={{
              flexGrow: 1,
              pl: { md: 8 },
              width: { md: `calc(100% - ${NAV.W_DRAWER}px)` },
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 5 }}
            >
              <ToggleButtonGroup
                exclusive
                size="small"
                value={viewMode}
                onChange={handleChangeViewMode}
                sx={{ borderColor: 'transparent' }}
              >
                {VIEW_OPTIONS.map((option) => (
                  <ToggleButton key={option.value} value={option.value}>
                    {option.icon}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>

              <FormControl size="small" hiddenLabel variant="filled" sx={{ width: 120 }}>
                <Select
                  value={sort}
                  onChange={handleChangeSort}
                  MenuProps={{
                    PaperProps: {
                      sx: { px: 1 },
                    },
                  }}
                >
                  {SORT_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            {error ? (
              <Typography color="error" align="center">
                {error}
              </Typography>
            ) : (
              <EcommerceProductList
                loading={loading}
                viewMode={viewMode}
                products={products.map(product => ({
                  id: product.id,
                  name: product.name,
                  coverImg: product.cover_url,
                  price: parseFloat(product.base_price),
                  priceSale: product.selling_price || 0,
                  sold: product.total_sold,
                  rating: product.total_ratings,
                  category: product.category.name,
                  caption: product.short_description,
                  description: product.description,
                  inStock: product.quantity,
                  review: product.total_reviews,
                  images: product.images,
                  label: product.tag[0] || '',
                }))}
              />
            )}
          </Box>
        </Stack>
      </Container>
    </>
  );
}
