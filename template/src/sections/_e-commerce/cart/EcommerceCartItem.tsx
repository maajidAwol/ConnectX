// @mui
import { Stack, TextField, IconButton, Typography } from '@mui/material';
// utils
import { fCurrency } from 'src/utils/formatNumber';
// types
import { IProductItemProps } from 'src/types/product';
// components
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  product: IProductItemProps;
  wishlist: boolean;
  onDelete?: () => void;
  onDecreaseQuantity?: () => void;
  onIncreaseQuantity?: () => void;
};

export default function EcommerceCartItem({ product, wishlist, onDelete, onDecreaseQuantity, onIncreaseQuantity }: Props) {
  return (
    <Stack direction="row" spacing={3}>
      <Image
        alt={product.name}
        src={product.cover_url}
        sx={{
          width: 80,
          height: 80,
          flexShrink: 0,
          borderRadius: 1.5,
        }}
      />

      <Stack flexGrow={1}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Stack flexGrow={1}>
            <Typography variant="subtitle2">{product.name}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {product.category.name}
            </Typography>
          </Stack>

          <Typography variant="subtitle2">
            {fCurrency(product.selling_price ? Number(product.selling_price) : Number(product.base_price))}
          </Typography>

          {!wishlist && (
            <IconButton onClick={onDelete}>
              <Iconify icon="carbon:trash-can" />
            </IconButton>
          )}
        </Stack>

        {!wishlist && (
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 2 }}>
            <TextField
              size="small"
              value={product.quantity}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value > 0) {
                  // Handle quantity change
                }
              }}
              sx={{ width: 80 }}
            />

            <IconButton onClick={onDecreaseQuantity}>
              <Iconify icon="carbon:subtract" />
            </IconButton>

            <IconButton onClick={onIncreaseQuantity}>
              <Iconify icon="carbon:add" />
            </IconButton>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
