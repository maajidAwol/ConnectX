import { useState } from 'react';
import NextLink from 'next/link';
// @mui
import {
  Box,
  Stack,
  Button,
  Drawer,
  IconButton,
  Typography,
  Divider,
  Badge,
} from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import Image from 'src/components/image';
// store
import { useCartStore } from 'src/store/cart';

// ----------------------------------------------------------------------

export function EcommerceCartPopover() {
  const [open, setOpen] = useState(false);
  const { items, removeItem, getTotalItems, getTotalPrice } = useCartStore();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton color="default" onClick={handleOpen}>
        <Badge badgeContent={getTotalItems()} color="error">
          <Iconify icon="carbon:shopping-cart" />
        </Badge>
      </IconButton>

      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 320 },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ p: 2.5 }}
        >
          <Typography variant="h6"> Cart ({getTotalItems()}) </Typography>

          <IconButton color="default" onClick={handleClose}>
            <Iconify icon="carbon:close" />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar sx={{ p: 2.5 }}>
          {items.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Cart is empty
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2.5}>
              {items.map((item) => (
                <Stack key={item.id} direction="row" spacing={2.5}>
                  <Image
                    src={item.cover_url}
                    alt={item.name}
                    sx={{
                      width: 64,
                      height: 64,
                      flexShrink: 0,
                      borderRadius: 1.5,
                      bgcolor: 'background.neutral',
                    }}
                  />

                  <Stack spacing={0.5} flexGrow={1}>
                    <Typography variant="subtitle2">{item.name}</Typography>

                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ typography: 'body2' }}
                    >
                      <Typography component="span" sx={{ color: 'text.secondary' }}>
                        {item.quantity} x
                      </Typography>

                      <Typography component="span" sx={{ color: 'text.primary' }}>
                        ${item.price}
                      </Typography>
                    </Stack>
                  </Stack>

                  <IconButton
                    size="small"
                    color="default"
                    onClick={() => removeItem(item.id)}
                  >
                    <Iconify icon="carbon:trash-can" />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          )}
        </Scrollbar>

        <Divider />

        <Box sx={{ p: 2.5 }}>
          <Stack spacing={2.5}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle2">Total</Typography>
              <Typography variant="h6">${getTotalPrice()}</Typography>
            </Stack>

            <Button
              component={NextLink}
              href={paths.eCommerce.cart}
              fullWidth
              size="large"
              variant="contained"
              color="primary"
            >
              View Cart
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
} 