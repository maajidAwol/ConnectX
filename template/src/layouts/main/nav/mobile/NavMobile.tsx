import { useState, useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import { List, Drawer, IconButton, Button, Stack, Divider } from '@mui/material';
// config
import { NAV } from 'src/config-global';
// components
import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
// store
import { useAuthStore } from 'src/store/auth';
// routes
import { paths } from 'src/routes/paths';
//
import { NavProps } from '../types';
import NavList from './NavList';

// ----------------------------------------------------------------------

export default function NavMobile({ data }: NavProps) {
  const { pathname } = useRouter();
  const { isAuthenticated, logout } = useAuthStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleOpen} sx={{ ml: 1, color: 'inherit' }}>
        <Iconify icon="carbon:menu" />
      </IconButton>

      <Drawer
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            pb: 5,
            width: NAV.W_BASE,
          },
        }}
      >
        <Scrollbar>
          <Logo sx={{ mx: 2.5, my: 3 }} />
        

          <List component="nav" disablePadding>
            {data.map((link) => (
              <NavList key={link.title} item={link} />
            ))}
          </List>

          {isAuthenticated && (
            <>
              <Divider sx={{ my: 2 }} />
              <List component="nav" disablePadding>
                <NavList
                  item={{
                    title: 'Account',
                    path: paths.eCommerce.account.personal,
                    children: [
                      {
                        subheader: 'Account',
                        items: [
                          { title: 'Profile', path: paths.eCommerce.account.personal },
                          { title: 'Orders', path: paths.eCommerce.account.orders },
                          { title: 'Wishlist', path: paths.eCommerce.account.wishlist },
                          { title: 'Payment', path: paths.eCommerce.account.payment },
                        ],
                      },
                    ],
                  }}
                />
              </List>
              <Stack spacing={1.5} sx={{ p: 3 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  onClick={handleLogout}
                  startIcon={<Iconify icon="carbon:logout" />}
                >
                  Logout
                </Button>
              </Stack>
            </>
          )}

          {!isAuthenticated && (
            <Stack spacing={1.5} sx={{ p: 3 }}>
              <Button
                fullWidth
                variant="contained"
                href={paths.auth.loginIllustration}
                startIcon={<Iconify icon="carbon:user" />}
              >
                Login
              </Button>
              <Button
                fullWidth
                variant="outlined"
                href={paths.auth.registerIllustration}
                startIcon={<Iconify icon="carbon:add" />}
              >
                Get Started
              </Button>
            </Stack>
          )}
        </Scrollbar>
      </Drawer>
    </>
  );
}
