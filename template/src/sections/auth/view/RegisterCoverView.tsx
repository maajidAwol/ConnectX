// next
import NextLink from 'next/link';
// @mui
import { Link, Stack, Box, Typography } from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
// components
import Logo from 'src/components/logo';
//
import { AuthCarousel, AuthRegisterForm } from '../components';

// ----------------------------------------------------------------------

export default function RegisterCoverView() {
  return (
    <Stack direction="row" sx={{ minHeight: 1 }}>
      <Box
        sx={{
          width: { xs: 1, md: 480 },
          p: (theme) => ({
            xs: theme.spacing(5, 2),
            md: theme.spacing(8, 10),
          }),
        }}
      >
        <Logo />

        <Stack
          sx={{
            pb: 5,
            pt: { xs: 5, md: 10 },
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Typography variant="h3" paragraph>
            Get Started
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {`Already have an account? `}
            <Link component={NextLink} href={paths.auth.loginCover} variant="subtitle2" color="primary">
              Login
            </Link>
          </Typography>
        </Stack>

        <AuthRegisterForm />
      </Box>

      <AuthCarousel
        title={`Register for ecommerce as customer`}
        images={[
          '/assets/images/travel/travel_post_01.jpg',
          '/assets/images/travel/travel_post_03.jpg',
        ]}
      />
    </Stack>
  );
}
