import { useState } from 'react';
// next
import NextLink from 'next/link';
// @mui
import { Stack, Button, Rating, Typography, TextField, Divider, Box } from '@mui/material';
// hooks
import useResponsive from 'src/hooks/useResponsive';
// routes
import { paths } from 'src/routes/paths';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
// store
import { useCartStore } from 'src/store/cart';
import { useReviewStore } from 'src/store/review';
//
import { ProductColorPicker, ProductPrice } from '../../components';
import ReviewSummary from 'src/sections/review/e-commerce/ReviewSummary';
import ReviewList from 'src/sections/review/e-commerce/ReviewList';
import ReviewNewForm from 'src/sections/review/components/ReviewNewForm';

// ----------------------------------------------------------------------

type Props = {
  id: string;
  name: string;
  price: number;
  priceSale: number;
  caption: string;
  inStock: number;
  colors: string[];
};

export default function EcommerceProductDetailsInfo({
  id,
  name,
  price,
  priceSale,
  caption,
  inStock,
  colors,
}: Props) {
  const isMdUp = useResponsive('up', 'md');
  const { addItem } = useCartStore();
  const [openReviewForm, setOpenReviewForm] = useState(false);

  const [color, setColor] = useState(colors[0] || '');
  const [quantity, setQuantity] = useState(1);

  const handleChangeColor = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor((event.target as HTMLInputElement).value);
  };

  const handleChangeQuantity = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number(event.target.value);
    if (newQuantity > 0 && newQuantity <= inStock) {
      setQuantity(newQuantity);
    }
  };

  const colorOptions = colors.map(color => ({
    label: color,
    value: color,
  }));

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      price,
      quantity,
      cover_url: '',
      color,
      colors: [],
      sizes: [],
      category: '',
    });
  };

  const handleOpenReviewForm = () => {
    setOpenReviewForm(true);
  };

  const handleCloseReviewForm = () => {
    setOpenReviewForm(false);
  };

  return (
    <>
      <Label color={inStock > 0 ? "success" : "error"} sx={{ mb: 3 }}>
        {inStock > 0 ? `In Stock (${inStock} available)` : 'Out of Stock'}
      </Label>

      <Stack spacing={1} sx={{ mb: 2 }}>
        <Typography variant="h4"> {name} </Typography>
      </Stack>

      <Stack spacing={2}>
        <ProductPrice price={price} priceSale={priceSale} sx={{ typography: 'h5' }} />

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {caption}
        </Typography>
      </Stack>

      {colorOptions.length > 0 && (
        <Stack spacing={3} sx={{ my: 5 }}>
          <Stack spacing={2}>
            <Typography variant="subtitle2">Color</Typography>
            <ProductColorPicker value={color} onChange={handleChangeColor} options={colorOptions} />
          </Stack>
        </Stack>
      )}

      <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }}>
        <TextField
          select
          hiddenLabel
          value={quantity}
          onChange={handleChangeQuantity}
          disabled={inStock === 0}
          SelectProps={{
            native: true,
          }}
          sx={{
            minWidth: 100,
          }}
        >
          {[...Array(Math.min(inStock, 10))].map((_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </TextField>

        <Stack direction="row" spacing={2}>
          <Button
            fullWidth={!isMdUp}
            size="large"
            variant="contained"
            startIcon={<Iconify icon="carbon:shopping-cart-plus" />}
            disabled={inStock === 0}
            onClick={handleAddToCart}
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              '&.Mui-disabled': {
                bgcolor: 'grey.300',
                color: 'grey.500',
              },
            }}
          >
            Add to Cart
          </Button>

          <Button
            component={NextLink}
            href={paths.eCommerce.checkout}
            fullWidth={!isMdUp}
            size="large"
            variant="contained"
            disabled={inStock === 0}
            sx={{
              bgcolor: 'success.main',
              color: 'success.contrastText',
              '&:hover': {
                bgcolor: 'success.dark',
              },
              '&.Mui-disabled': {
                bgcolor: 'grey.300',
                color: 'grey.500',
              },
            }}
          >
            Buy Now
          </Button>
        </Stack>
      </Stack>

      <Divider sx={{ borderStyle: 'dashed', my: 3 }} />

      <Stack spacing={2} direction="row" justifyContent={{ xs: 'center', md: 'unset' }}>
        <Stack direction="row" alignItems="center" sx={{ typography: 'subtitle2' }}>
          <Iconify icon="carbon:add-alt" sx={{ mr: 1 }} /> Compare
        </Stack>

        <Stack direction="row" alignItems="center" sx={{ typography: 'subtitle2' }}>
          <Iconify icon="carbon:favorite" sx={{ mr: 1 }} /> Favorite
        </Stack>

        <Stack direction="row" alignItems="center" sx={{ typography: 'subtitle2' }}>
          <Iconify icon="carbon:share" sx={{ mr: 1 }} /> Share
        </Stack>
      </Stack>

      <Divider sx={{ borderStyle: 'dashed', my: 3 }} />

      {/* Product Description */}
      <Typography variant="body1" sx={{ mb: 3 }}>
        {caption}
      </Typography>

     
    </>
  );
}
