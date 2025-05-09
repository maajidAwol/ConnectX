import { useState } from 'react';
// next
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Avatar,
  ListItemIcon,
  Divider,
  IconButton,
  Typography,
} from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
// store
import { useAuthStore } from 'src/store/auth';
// components
import Iconify from 'src/components/iconify';

export default function AuthButtons() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    router.push('/');
  };

  if (!isAuthenticated) {
    return (
      <Button
        variant="contained"
        color="inherit"
        component={NextLink}
        href={paths.loginIllustration}
      >
        Sign In
      </Button>
    );
  }

  return (
    <Box>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => theme.palette.background.neutral,
        }}
      >
        <Avatar
          src={user?.avatar_url || undefined}
          alt={user?.name}
          sx={{ width: 32, height: 32 }}
        >
          {user?.name?.charAt(0)}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 220, maxWidth: '100%' },
        }}
      >
        <Box sx={{ py: 1, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap>
            {user?.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          component={NextLink}
          href={paths.eCommerce.account.root}
          onClick={handleClose}
        >
          <ListItemIcon>
            <Iconify icon="solar:user-id-bold" width={24} />
          </ListItemIcon>
          Profile
        </MenuItem>

        <MenuItem
          component={NextLink}
          href={paths.eCommerce.account.orders}
          onClick={handleClose}
        >
          <ListItemIcon>
            <Iconify icon="solar:order-play-bold" width={24} />
          </ListItemIcon>
          Orders
        </MenuItem>

        <MenuItem
          component={NextLink}
          href={paths.eCommerce.account.wishlist}
          onClick={handleClose}
        >
          <ListItemIcon>
            <Iconify icon="solar:heart-bold" width={24} />
          </ListItemIcon>
          Wishlist
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Iconify icon="solar:logout-3-bold" width={24} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}