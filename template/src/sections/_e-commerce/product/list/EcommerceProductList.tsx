// @mui
import { Box, Stack, Pagination, Typography, Chip, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { useEffect } from 'react';
// types
import { IProductItemProps } from 'src/types/product';
// store
import { useProductStore } from 'src/store/product';
//
import {
  EcommerceProductViewListItem,
  EcommerceProductViewGridItem,
  EcommerceProductViewListItemSkeleton,
  EcommerceProductViewGridItemSkeleton,
} from '../item';

// ----------------------------------------------------------------------

type Props = {
  products: IProductItemProps[];
  viewMode: string;
  loading?: boolean;
};

export default function EcommerceProductList({ loading, viewMode, products }: Props) {
  const { 
    totalCount, 
    currentPage, 
    fetchProducts, 
    error, 
    categories, 
    fetchListedCategories,
    selectedCategoryId,
    setSelectedCategory,
    sortBy,
    setSortBy
  } = useProductStore();

  const PAGE_SIZE = 5;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // Fetch categories on component mount
  useEffect(() => {
    fetchListedCategories();
  }, [fetchListedCategories]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    fetchProducts(page, 'listed', selectedCategoryId, sortBy);
  };

  const handleCategoryClick = (categoryId: string | null) => {
    event?.preventDefault();
    setSelectedCategory(categoryId);
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortBy(event.target.value);
  };

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  if (!loading && (!products || products.length === 0)) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">
          {selectedCategoryId ? 'No products found in this category' : 'No products found'}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Stack 
        direction="row" 
        spacing={2} 
        sx={{ 
          mb: 3, 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {Array.isArray(categories) && categories.length > 0 && (
          <Stack 
            direction="row" 
            spacing={1} 
            sx={{ 
              flexWrap: 'wrap', 
              gap: 1,
              flex: 1,
            }}
          >
            {categories.map((category) => (
              <Chip
                key={category.id}
                label={category.name}
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryClick(category.id);
                }}
                color={selectedCategoryId === category.id ? 'primary' : 'default'}
                sx={{ 
                  m: 0.5,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: (theme) => theme.customShadows.z8,
                  },
                }}
              />
            ))}
          </Stack>
        )}

        <FormControl 
          sx={{ 
            minWidth: 200,
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.paper',
              '&:hover': {
                '& > fieldset': {
                  borderColor: 'primary.main',
                },
              },
            },
          }}
        >
          <InputLabel>Sort By</InputLabel>
          <Select<string>
            value={sortBy}
            label="Sort By"
            onChange={handleSortChange}
          >
            <MenuItem value="latest">Latest</MenuItem>
            <MenuItem value="price_asc">Price: Low to High</MenuItem>
            <MenuItem value="price_desc">Price: High to Low</MenuItem>
            <MenuItem value="rating">Rating</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {viewMode === 'grid' ? (
        <Box
          rowGap={4}
          columnGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }}
          sx={{
            '& > *': {
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            },
          }}
        >
          {(loading ? [...Array(PAGE_SIZE)] : products).map((product, index) =>
            product ? (
              <EcommerceProductViewGridItem 
                key={product.id} 
                product={{
                  ...product,
                  rating: product.review?.average_rating || 0,
                  totalReviews: product.review?.total_reviews || 0
                }} 
              />
            ) : (
              <EcommerceProductViewGridItemSkeleton key={index} />
            )
          )}
        </Box>
      ) : (
        <Stack spacing={4}>
          {(loading ? [...Array(PAGE_SIZE)] : products).map((product, index) =>
            product ? (
              <EcommerceProductViewListItem 
                key={product.id} 
                product={{
                  ...product,
                  rating: product.review?.average_rating || 0,
                  totalReviews: product.review?.total_reviews || 0
                }} 
              />
            ) : (
              <EcommerceProductViewListItemSkeleton key={index} />
            )
          )}
        </Stack>
      )}

      {totalPages > 1 && (
        <Pagination
          page={currentPage}
          count={totalPages}
          color="primary"
          size="large"
          onChange={handlePageChange}
          sx={{
            mt: 10,
            mb: 5,
            '& .MuiPagination-ul': {
              justifyContent: 'center',
            },
            '& .MuiPaginationItem-root': {
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              },
            },
          }}
        />
      )}
    </>
  );
}
