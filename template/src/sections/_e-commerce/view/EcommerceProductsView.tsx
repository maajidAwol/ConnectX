import { useState, useEffect, useCallback } from 'react';
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
  Grid,
} from '@mui/material';
// hooks
import useResponsive from 'src/hooks/useResponsive';
// config
import { NAV } from 'src/config-global';
// components
import Iconify from 'src/components/iconify';
// store
import { useProductStore } from 'src/store/product';
import { useAuthStore } from 'src/store/auth';
// api
import { apiRequest } from 'src/lib/api-config';
//
import EcommerceFilters from '../product/filters';
import { EcommerceProductList, EcommerceProductListBestSellers } from '../product/list';
import LoadingScreen from 'src/components/loading-screen';

// ----------------------------------------------------------------------

interface Category {
  id: string;
  name: string;
}

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
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const router = useRouter();

  const { products, loading, error, fetchProducts } = useProductStore();

  // Add a separate effect for initial load
  useEffect(() => {
    // Reset to initial state when component mounts
    setSelectedCategoryId(null);
    setSort('latest');
    fetchProducts(1, 'listed', null, 'latest');
  }, [fetchProducts]);

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

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
  };

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

  return (
    <>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 5 }}
        >
          <Stack direction="row" spacing={1} flexShrink={0}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleChangeViewMode}
              aria-label="view mode"
            >
              <ToggleButton value="grid" aria-label="grid view">
                <Iconify icon="carbon:grid-view" />
              </ToggleButton>
              <ToggleButton value="list" aria-label="list view">
                <Iconify icon="carbon:list" />
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
              <Select value={sort} onChange={handleChangeSort}>
                <MenuItem value="latest">Latest</MenuItem>
                <MenuItem value="price-asc">Price: Low to High</MenuItem>
                <MenuItem value="price-desc">Price: High to Low</MenuItem>
                <MenuItem value="rating">Top Rated</MenuItem>
              </Select>
            </FormControl>

            <Button
              color="inherit"
              variant="outlined"
              startIcon={<Iconify icon="carbon:filter" />}
              onClick={handleMobileOpen}
              sx={{ display: { md: 'none' } }}
            >
              Filters
            </Button>
          </Stack>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <EcommerceFilters
              mobileOpen={mobileOpen}
              onMobileClose={handleMobileClose}
              onSelectCategory={handleCategorySelect}
              selectedCategoryId={selectedCategoryId}
            />
          </Grid>

          <Grid item xs={12} md={9}>
            <EcommerceProductList
              loading={loading}
              viewMode={viewMode}
              products={products}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
