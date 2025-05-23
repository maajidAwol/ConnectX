import { useState } from 'react';
// @mui
import { Container, Stack, Typography, Button, Box } from '@mui/material';
// hooks
import useResponsive from 'src/hooks/useResponsive';
// config
import { NAV } from 'src/config-global';
// components
import Iconify from 'src/components/iconify';
// store
import { useAuthStore } from 'src/store/auth';
//
import EcommerceAccountMenu from './EcommerceAccountMenu';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function EcommerceAccountLayout({ children }: Props) {
  const isMdUp = useResponsive('up', 'md');
  const { user } = useAuthStore();
  const [menuOpen, setMemuOpen] = useState(false);

  const handleMenuOpen = () => {
    setMemuOpen(true);
  };

  const handleMenuClose = () => {
    setMemuOpen(false);
  };

  if (!user) {
    return null;
  }

  return (
    <>
      {/* <EcommerceHeader /> */}

      {isMdUp ? (
        <Container sx={{ my: 5 }}>
          <Typography variant="h3">My Account</Typography>
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Welcome back, {user.name}
          </Typography>
        </Container>
      ) : (
        <Box sx={{ py: 2, mb: 5, borderBottom: (theme) => `solid 1px ${theme.palette.divider}` }}>
          <Container>
            <Button
              size="small"
              color="inherit"
              startIcon={<Iconify icon="carbon:menu" />}
              onClick={handleMenuOpen}
            >
              Account
            </Button>
          </Container>
        </Box>
      )}

      <Container>
        <Stack
          direction={{
            md: 'row',
          }}
          alignItems={{
            md: 'flex-start',
          }}
          sx={{
            mb: {
              xs: 8,
              md: 10,
            },
          }}
        >
          <EcommerceAccountMenu open={menuOpen} onClose={handleMenuClose} />

          <Box
            sx={{
              flexGrow: 1,
              pl: { md: 8 },
              width: { md: `calc(100% - ${NAV.W_DRAWER}px)` },
            }}
          >
            {children}
          </Box>
        </Stack>
      </Container>
    </>
  );
}
