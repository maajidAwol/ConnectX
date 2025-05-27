import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
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
import { useAuthStore } from 'src/store/auth';

// ----------------------------------------------------------------------

export function EcommerceCartPopover() {
  const [open, setOpen] = useState(false);
  const { items, removeItem, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { push } = useRouter();

  // Clear cart when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      clearCart();
    }
  }, [isAuthenticated, clearCart]);

  const handleOpen = () => {
    if (!isAuthenticated) {
      push('/auth/login-illustration?message=Please login to view your cart');
      return;
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleViewCart = () => {
    handleClose();
    push(paths.eCommerce.cart);
  };

  return (
    <>
      <IconButton color="default" onClick={handleOpen}>
        <Badge badgeContent={isAuthenticated ? getTotalItems() : 0} color="error">
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

        {items.length > 0 ? (
          <>
            <Scrollbar sx={{ flexGrow: 1 }}>
              <Stack spacing={3} sx={{ p: 3 }}>
                {items.map((item) => (
                  <Stack key={item.id} direction="row" spacing={2}>
                    <Image
                      alt={item.name}
                      src={item.cover_url}
                      sx={{ width: 72, height: 72, borderRadius: 1 }}
                    />

                    <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2">{item.name}</Typography>

                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ typography: 'body2' }}
                      >
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {item.quantity} x
                        </Typography>

                        <Typography variant="subtitle2">
                          {item.price}
                        </Typography>
                      </Stack>
                    </Stack>

                    <IconButton
                      color="default"
                      onClick={() => removeItem(item.id)}
                    >
                      <Iconify icon="carbon:trash-can" />
                    </IconButton>
                  </Stack>
                ))}
              </Stack>
            </Scrollbar>

            <Divider />

            <Stack spacing={2.5} sx={{ p: 3 }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="subtitle2">Total</Typography>
                <Typography variant="h6">{getTotalPrice()}</Typography>
              </Stack>

              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleViewCart}
              >
                View Cart
              </Button>
            </Stack>
          </>
        ) : (
          <Stack spacing={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="subtitle1">Your cart is empty</Typography>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => {
                handleClose();
                push(paths.eCommerce.products);
              }}
            >
              Continue Shopping
            </Button>
          </Stack>
        )}
      </Drawer>
    </>
  );
} 