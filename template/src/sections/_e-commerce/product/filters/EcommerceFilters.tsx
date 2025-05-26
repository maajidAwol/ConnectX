import { useState } from 'react';
// @mui
import { Stack, Drawer, Button, Collapse, Typography, StackProps, Box } from '@mui/material';
// hooks
import useResponsive from 'src/hooks/useResponsive';
// config
import { NAV } from 'src/config-global';
// types
import { IProductFiltersProps } from 'src/types/product';
// components
import Iconify from 'src/components/iconify';
// store
import { useProductStore } from 'src/store/product';
//
import {
  EcommerceFilterTag,
  EcommerceFilterBrand,
  EcommerceFilterPrice,
  EcommerceFilterStock,
  EcommerceFilterRating,
  EcommerceFilterCategory,
} from './components';

// ----------------------------------------------------------------------

const BRAND_OPTIONS = ['Apple', 'Samsung', 'Xiaomi', 'Honor'];

const TAG_OPTIONS = ['Books and Media', 'Pet', 'Electronics', 'Food', 'Automotive and Industrial'];

// ----------------------------------------------------------------------

const defaultValues = {
  filterBrand: [BRAND_OPTIONS[1]],
  filterCategories: '',
  filterRating: null,
  filterStock: false,
  filterTag: [],
  filterPrice: {
    start: 0,
    end: 0,
  },
  filterShipping: [],
};

interface Category {
  id: string;
  name: string;
  icon: string | null;
  description: string;
  created_at: string;
  updated_at: string;
  tenant: string;
  parent: string | null;
}

type Props = {
  mobileOpen: boolean;
  onMobileClose: VoidFunction;
  categories: Category[];
};

export default function EcommerceFilters({ mobileOpen, onMobileClose, categories = [] }: Props) {
  const isMdUp = useResponsive('up', 'md');
  const { selectedCategoryId, setSelectedCategory, fetchProducts, currentPage } = useProductStore();

  const [filters, setFilters] = useState<IProductFiltersProps>({
    ...defaultValues,
    filterCategories: selectedCategoryId || '',
  });

  const getSelected = (selectedItems: string[], item: string) =>
    selectedItems.includes(item)
      ? selectedItems.filter((value) => value !== item)
      : [...selectedItems, item];

  const handleChangeCategories = (categoryId: string) => {
    const newCategoryId = categoryId === 'all' ? null : categoryId;
    setSelectedCategory(newCategoryId);
    setFilters({
      ...filters,
      filterCategories: categoryId,
    });
    // Fetch products with the new category
    fetchProducts(currentPage, 'listed', newCategoryId);
  };

  const handleChangeBrand = (name: string) => {
    setFilters({
      ...filters,
      filterBrand: getSelected(filters.filterBrand, name),
    });
  };

  const handleChangeTag = (name: string) => {
    setFilters({
      ...filters,
      filterTag: getSelected(filters.filterTag, name),
    });
  };

  const handleChangeRating = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      filterRating: (event.target as HTMLInputElement).value,
    });
  };

  const handleChangeStartPrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      filterPrice: {
        ...filters.filterPrice,
        start: Number(event.target.value),
      },
    });
  };

  const handleChangeEndPrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      filterPrice: {
        ...filters.filterPrice,
        end: Number(event.target.value),
      },
    });
  };

  const handleChangeStock = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      filterStock: event.target.checked,
    });
  };

  const handleClearAll = () => {
    setFilters({
      ...defaultValues,
      filterCategories: '',
    });
    setSelectedCategory(null);
    // Fetch products with no category filter
    fetchProducts(currentPage, 'listed', null);
  };

  const renderContent = (
    <Stack
      spacing={3}
      alignItems="flex-start"
      sx={{
        flexShrink: 0,
        width: { xs: 1, md: NAV.W_DRAWER },
        bgcolor: 'background.neutral',
        borderRadius: 1,
        p: 3,
      }}
    >
      <Block title="Category">
        <EcommerceFilterCategory
          filterCategories={selectedCategoryId || 'all'}
          onChangeCategories={handleChangeCategories}
          options={[
            { 
              id: 'all', 
              name: 'All Categories',
              icon: null,
              description: 'View all products',
              created_at: '',
              updated_at: '',
              tenant: '',
              parent: null
            },
            ...categories
          ]}
          sx={{ mt: 2 }}
        />
      </Block>

      {/* <Block title="Brand">
        <EcommerceFilterBrand
          filterBrand={filters.filterBrand}
          onChangeBrand={handleChangeBrand}
          options={BRAND_OPTIONS}
          sx={{ mt: 1 }}
        />
      </Block> */}

      {/* <Block title="Ratings">
        <EcommerceFilterRating
          filterRating={filters.filterRating}
          onChangeRating={handleChangeRating}
          sx={{ mt: 2 }}
        />
      </Block> */}

      {/* <EcommerceFilterStock 
        filterStock={filters.filterStock} 
        onChangeStock={handleChangeStock}
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 1,
          p: 2,
          width: '100%',
        }}
      /> */}

      <Block title="Tags">
        <EcommerceFilterTag
          filterTag={filters.filterTag}
          onChangeTag={handleChangeTag}
          options={TAG_OPTIONS}
          sx={{ mt: 2 }}
        />
      </Block>

      <Button
        fullWidth
        size="large"
        variant="contained"
        startIcon={<Iconify icon="carbon:trash-can" />}
        onClick={handleClearAll}
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        }}
      >
        Clear All
      </Button>
    </Stack>
  );

  return (
    <>
      {isMdUp ? (
        renderContent
      ) : (
        <Drawer
          anchor="right"
          open={mobileOpen}
          onClose={onMobileClose}
          ModalProps={{ keepMounted: true }}
          PaperProps={{
            sx: {
              pt: 3,
              px: 3,
              width: NAV.W_DRAWER,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

interface BlockProps extends StackProps {
  title: string;
  children: React.ReactNode;
}

function Block({ title, children, ...other }: BlockProps) {
  const [checked, setChecked] = useState(true);

  const handleOpen = () => {
    setChecked((prev) => !prev);
  };

  return (
    <Stack 
      alignItems="flex-start" 
      sx={{ 
        width: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
        p: 2,
      }} 
      {...other}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        onClick={handleOpen}
        sx={{ 
          width: 1, 
          cursor: 'pointer',
          '&:hover': {
            '& .MuiTypography-root': {
              color: 'primary.main',
            },
          },
        }}
      >
        <Typography 
          variant="h6"
          sx={{
            transition: 'color 0.2s ease-in-out',
          }}
        >
          {title}
        </Typography>

        <Iconify
          icon={checked ? 'carbon:subtract' : 'carbon:add'}
          sx={{ 
            color: 'text.secondary',
            transition: 'transform 0.2s ease-in-out',
            transform: checked ? 'rotate(0deg)' : 'rotate(90deg)',
          }}
        />
      </Stack>

      <Collapse unmountOnExit in={checked} sx={{ px: 0.5, width: 1 }}>
        {children}
      </Collapse>
    </Stack>
  );
}
