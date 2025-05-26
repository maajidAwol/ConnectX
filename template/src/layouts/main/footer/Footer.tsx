// next
// import { useRouter } from 'next/router';
// @mui
import { alpha, styled } from '@mui/material/styles';
import {
  Link,
  Stack,
  Button,
  Divider,
  Container,
  TextField,
  Typography,
  IconButton,
  StackProps,
  InputAdornment,
  Unstable_Grid2 as Grid,
} from '@mui/material';
// hooks
import useResponsive from 'src/hooks/useResponsive';
// _mock
import { _socials } from 'src/_mock';
// components
import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const StyledAppStoreButton = styled(Button)(({ theme }) => ({
  flexShrink: 0,
  padding: '5px 12px',
  margin: theme.spacing(1),
  color: theme.palette.common.white,
  border: `solid 1px ${alpha(theme.palette.common.black, 0.24)}`,
  background: `linear-gradient(180deg, ${theme.palette.grey[900]} 0%, ${theme.palette.common.black} 100%)`,
  '& .MuiButton-startIcon': {
    marginLeft: 0,
  },
}));

// ----------------------------------------------------------------------

export default function Footer() {
  const isMdUp = useResponsive('up', 'md');

  const mainFooter = (
    <>
      <Divider />

      <Container
        sx={{
          overflow: 'hidden',
          py: { xs: 8, md: 10 },
        }}
      >
        <Grid container spacing={3} justifyContent={{ md: 'space-between' }}>
          <Grid xs={12} md={4}>
            <Stack spacing={{ xs: 3, md: 5 }}>
              <Stack alignItems="flex-start" spacing={3}>
                <Logo isFooter />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Your one-stop shop for all your needs. Discover the best deals and latest trends in our store.
                </Typography>
              </Stack>

              <Stack spacing={1} alignItems="flex-start">
                <Typography variant="h6">Quick Links</Typography>
                <Link href="/" variant="body2" sx={{ color: 'text.primary', textDecoration: 'none', '&:hover': { textDecoration: 'underline', color: 'primary.main' } }}>
                  Home
                </Link>
                <Link href="/products" variant="body2" sx={{ color: 'text.primary', textDecoration: 'none', '&:hover': { textDecoration: 'underline', color: 'primary.main' } }}>
                  Shop
                </Link>
                <Link href="/about" variant="body2" sx={{ color: 'text.primary', textDecoration: 'none', '&:hover': { textDecoration: 'underline', color: 'primary.main' } }}>
                  About Us
                </Link>
                <Link href="/contact" variant="body2" sx={{ color: 'text.primary', textDecoration: 'none', '&:hover': { textDecoration: 'underline', color: 'primary.main' } }}>
                  Contact Us
                </Link>
                <Link href="/merchant" variant="body2" sx={{ color: 'text.primary', textDecoration: 'none', '&:hover': { textDecoration: 'underline', color: 'primary.main' } }}>
                  Become a Merchant
                </Link>
              </Stack>

              <Stack spacing={2}>
                <Stack spacing={1}>
                  <Typography variant="h6">Subscribe to Our Newsletter</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Get the latest updates on new products and upcoming sales.
                  </Typography>
                </Stack>

                <TextField
                  fullWidth
                  hiddenLabel
                  placeholder="Email address"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button 
                          variant="contained" 
                          size="large"
                          sx={{
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            '&:hover': {
                              bgcolor: 'primary.dark',
                            },
                          }}
                        >
                          Subscribe
                        </Button>
                      </InputAdornment>
                    ),
                    sx: { pr: 0.5 },
                  }}
                />
              </Stack>

              <Stack spacing={2}>
                <Typography variant="h6">Follow Us</Typography>
                <Stack direction="row" alignItems="center">
                  {_socials.map((social) => (
                    <IconButton 
                      key={social.value} 
                      sx={{
                        color: 'primary.main',
                        '&:hover': {
                          bgcolor: 'primary.lighter',
                        },
                      }}
                    >
                      <Iconify icon={social.icon} />
                    </IconButton>
                  ))}
                </Stack>
              </Stack>

              <Stack spacing={2}>
                <Typography variant="h6">Download Our App</Typography>
                <AppStoreButton />
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Container>
      <Divider />
      <Container>
        <Stack
          spacing={2.5}
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          sx={{ py: 3, textAlign: 'center' }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            © {new Date().getFullYear()}. All rights reserved
          </Typography>

          <Stack direction="row" spacing={3} justifyContent="center">
            <Link 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline',
                },
              }}
            >
              Privacy Policy
            </Link>

            <Link 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline',
                },
              }}
            >
              Terms of Service
            </Link>
          </Stack>
        </Stack>
      </Container>
    </>
  );

  return <footer>{mainFooter}</footer>;
}

// ----------------------------------------------------------------------

interface AppStoreButtonProps extends StackProps {}

function AppStoreButton({ ...other }: AppStoreButtonProps) {
  return (
    <Stack direction="row" flexWrap="wrap" {...other}>
      <StyledAppStoreButton startIcon={<Iconify icon="ri:apple-fill" width={28} />}>
        <Stack alignItems="flex-start">
          <Typography variant="caption" sx={{ opacity: 0.72 }}>
            Download on the
          </Typography>

          <Typography variant="h6" sx={{ mt: -0.5 }}>
            Apple Store
          </Typography>
        </Stack>
      </StyledAppStoreButton>

      <StyledAppStoreButton startIcon={<Iconify icon="logos:google-play-icon" width={28} />}>
        <Stack alignItems="flex-start">
          <Typography variant="caption" sx={{ opacity: 0.72 }}>
            Download from
          </Typography>
          <Typography variant="h6" sx={{ mt: -0.5 }}>
            Google Play
          </Typography>
        </Stack>
      </StyledAppStoreButton>
    </Stack>
  );
}
