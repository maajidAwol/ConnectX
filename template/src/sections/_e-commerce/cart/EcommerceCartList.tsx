import { useState } from 'react';
// @mui
import {
  Stack,
  Button,
  Divider,
  Typography,
  IconButton,
} from '@mui/material';
// types
import { IProductItemProps } from 'src/types/product';
// components
import Iconify from 'src/components/iconify';
import { useCartStore } from 'src/store/cart';
import { useRouter } from 'next/router';
import { paths } from 'src/routes/paths';
// utils
import { fCurrency } from 'src/utils/formatNumber';
import { CartItem } from 'src/store/cart';

// ----------------------------------------------------------------------

type Props = {
  products: CartItem[];
};

export default function EcommerceCartList({ products }: Props) {
  const { items, removeItem, increaseQuantity, decreaseQuantity } = useCartStore();

  const handleDelete = (id: string) => {
    removeItem(id);
  };

  const handleDecreaseQuantity = (id: string) => {
    const item = items.find((item) => item.id === id);
    if (item && item.quantity > 1) {
      decreaseQuantity(id);
    }
  };

  const handleIncreaseQuantity = (id: string) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      increaseQuantity(id);
    }
  };

  return (
    <Stack spacing={3}>
      {items.map((product) => (
        <Stack
          key={product.id}
          direction="row"
          alignItems="center"
          sx={{
            py: 3,
            minWidth: 720,
            borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
          }}
        >
          <Stack direction="row" alignItems="center" flexGrow={1}>
            <img
              src={product.cover_url}
              alt={product.name}
              style={{
                width: 80,
                height: 80,
                objectFit: 'cover',
                borderRadius: 1,
              }}
            />

            <Stack spacing={0.5} sx={{ p: 2 }}>
              <Typography variant="subtitle2">{product.name}</Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {fCurrency(product.price)}
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton
                size="small"
                color="inherit"
                onClick={() => handleDecreaseQuantity(product.id)}
                disabled={product.quantity <= 1}
              >
                <Iconify icon="carbon:subtract" />
              </IconButton>

              <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'center' }}>
                {product.quantity}
              </Typography>

              <IconButton
                size="small"
                color="inherit"
                onClick={() => handleIncreaseQuantity(product.id)}
              >
                <Iconify icon="carbon:add" />
              </IconButton>
            </Stack>

            <IconButton color="inherit" onClick={() => handleDelete(product.id)}>
              <Iconify icon="carbon:trash-can" />
            </IconButton>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
