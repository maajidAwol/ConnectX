// @mui
import { Box, Stack, Pagination, Typography, Chip } from '@mui/material';
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
  const { totalCount, currentPage, fetchProducts, error, categories, fetchListedCategories } = useProductStore();
  const PAGE_SIZE = 5;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // Fetch categories on component mount
  useEffect(() => {
    fetchListedCategories();
  }, [fetchListedCategories]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    fetchProducts(page, 'listed', null, 'latest');
  };

  const handleCategoryClick = (categoryId: string) => {
    fetchProducts(1, 'listed', categoryId, 'latest');
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
        <Typography variant="h6">No products found</Typography>
      </Box>
    );
  }

  return (
    <>
      {Array.isArray(categories) && categories.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
          {categories.map((category) => (
            <Chip
              key={category.id}
              label={category.name}
              onClick={() => handleCategoryClick(category.id)}
              sx={{ m: 0.5 }}
            />
          ))}
        </Stack>
      )}

      {viewMode === 'grid' ? (
        <Box
          rowGap={4}
          columnGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }}
        >
          {(loading ? [...Array(PAGE_SIZE)] : products).map((product, index) =>
            product ? (
              <EcommerceProductViewGridItem key={product.id} product={product} />
            ) : (
              <EcommerceProductViewGridItemSkeleton key={index} />
            )
          )}
        </Box>
      ) : (
        <Stack spacing={4}>
          {(loading ? [...Array(PAGE_SIZE)] : products).map((product, index) =>
            product ? (
              <EcommerceProductViewListItem key={product.id} product={product} />
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
          }}
        />
      )}
    </>
  );
}
