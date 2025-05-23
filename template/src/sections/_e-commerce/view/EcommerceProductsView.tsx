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
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const router = useRouter();
  const { products, loading, error, fetchProducts } = useProductStore();
  const { isAuthenticated, accessToken } = useAuthStore();
  const isMdUp = useResponsive('up', 'md');

  const fetchListedCategories = useCallback(async () => {
    try {
      const response = await apiRequest<{
        count: number;
        next: string | null;
        previous: string | null;
        results: Category[];
      }>('/products/listed-categories/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response?.results) {
        setCategories(response.results);
      }
    } catch (error) {
      console.error('Error fetching listed categories:', error);
    }
  }, [accessToken]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchListedCategories();
    }
  }, [isAuthenticated, fetchListedCategories]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts(
        1, // Start with page 1
        'listed', // Filter type - ensure we only get listed products
        selectedCategoryId, // Category ID for filtering
        sort // Sorting option
      );
    }
  }, [isAuthenticated, fetchProducts, selectedCategoryId, sort]);

  // Add a separate effect for initial load
  useEffect(() => {
    if (isAuthenticated) {
      // Reset to initial state when component mounts
      setSelectedCategoryId(null);
      setSort('latest');
      fetchProducts(1, 'listed', null, 'latest');
    }
  }, [isAuthenticated, fetchProducts]);

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

          {!isMdUp && (
            <Button
              color="inherit"
              variant="contained"
              startIcon={<Iconify icon="carbon:filter" width={18} />}
              onClick={handleMobileOpen}
            >
              Filters
            </Button>
          )}

          {isMdUp && (
            <Stack direction="row" alignItems="center" spacing={2}>
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
          )}

        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ md: 8 }}>
          <Box sx={{ width: { md: NAV.W_DRAWER }, flexShrink: 0 }}>
            <EcommerceFilters 
              mobileOpen={mobileOpen}
              onMobileClose={handleMobileClose}
              categories={categories}
              onSelectCategory={handleCategorySelect}
              selectedCategoryId={selectedCategoryId}
            />
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            {error ? (
              <Typography color="error" align="center">
                {error}
              </Typography>
            ) : (
              <EcommerceProductList
                loading={loading}
                viewMode={viewMode}
                products={products}
              />
            )}
          </Box>
        </Stack>

      </Container>
    </>
  );
}
