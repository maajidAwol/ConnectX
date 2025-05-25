import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { add } from 'date-fns';
// @mui
import {
  Box,
  Stack,
  alpha,
  Button,
  Divider,
  Container,
  Typography,
  StackProps,
  Snackbar,
  Alert,
} from '@mui/material';
// components
import Image from 'src/components/image';
// store
import { useAuthStore } from 'src/store/auth';
// api
import { apiRequest } from 'src/lib/api-config';
//
import { ProductCountdownBlock } from '../components';

// ----------------------------------------------------------------------

interface ProductResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  base_price: string;
  cover_url: string;
  selling_price: string;
  colors?: string[];
  sizes?: string[];
  category: {
    name: string;
  };
}

export default function EcommerceLandingSpecialOffer() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [showAuthAlert, setShowAuthAlert] = useState(false);

  useEffect(() => {
    const fetchRandomProduct = async () => {
      try {
        const response = await apiRequest<ProductResponse>('/products/', {
          method: 'GET',
        });
        
        if (response?.results?.length > 0) {
          // Get a random product from the results
          const randomIndex = Math.floor(Math.random() * response.results.length);
          setProduct(response.results[randomIndex]);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchRandomProduct();
  }, []);

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      setShowAuthAlert(true);
      setTimeout(() => {
        router.push('/auth/login-illustration');
      }, 2000);
      return;
    }
    router.push('/e-commerce/checkout');
  };

  if (!product) {
    return null;
  }

  return (
    <Container
      sx={{
        py: { xs: 5, md: 8 },
      }}
    >
      <Typography
        variant="h3"
        sx={{
          mb: 8,
          textAlign: { xs: 'center', md: 'unset' },
        }}
      >
        Special Offer
      </Typography>

      <Box
        gap={{ xs: 5, md: 8 }}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
      >
        <SpecialOfferCountdown
          label={product.category.name}
          name={product.name}
          price={`From $${product.base_price}`}
          expired={add(new Date(), { days: 1, hours: 8 })}
        />

        <Box sx={{ borderRadius: 1.5, bgcolor: 'background.neutral' }}>
          <Image src={product.cover_url} alt={product.name} />
        </Box>

        <SpecialOfferBuyNow
          product={product}
          onBuyNow={handleBuyNow}
        />
      </Box>

      <Snackbar 
        open={showAuthAlert} 
        autoHideDuration={2000} 
        onClose={() => setShowAuthAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="info" sx={{ width: '100%' }}>
          Please sign in to continue with your purchase
        </Alert>
      </Snackbar>
    </Container>
  );
}

// ----------------------------------------------------------------------

interface SpecialOfferCountdownProps extends StackProps {
  expired: Date;
  label: string;
  name: string;
  price: string;
}

function SpecialOfferCountdown({
  expired,
  label,
  name,
  price,
  sx,
  ...other
}: SpecialOfferCountdownProps) {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        p: 5,
        borderRadius: 2,
        textAlign: 'center',
        boxShadow: (theme) => theme.customShadows.z24,
        ...sx,
      }}
      {...other}
    >
      <Typography variant="overline" sx={{ color: 'primary.main' }}>
        {label}
      </Typography>

      <Typography variant="h5" sx={{ mt: 1, mb: 3 }}>
        {name}
      </Typography>

      <Typography
        variant="subtitle2"
        sx={{
          px: 2,
          py: 1,
          borderRadius: 1,
          border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.24)}`,
        }}
      >
        {price}
      </Typography>

      <Divider sx={{ borderStyle: 'dashed', my: 3, width: 1 }} />

      <Typography variant="body2" sx={{ mb: 2 }}>
        Deal ends in:
      </Typography>

      <ProductCountdownBlock
        expired={expired}
        sx={{
          '& .value': {
            color: 'text.primary',
            bgcolor: 'transparent',
            border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.32)}`,
          },
          '& .label': { color: 'text.secondary' },
          '& .separator': { color: 'inherit' },
        }}
      />
    </Stack>
  );
}

// ----------------------------------------------------------------------

interface SpecialOfferBuyNowProps extends StackProps {
  product: Product;
  onBuyNow: () => void;
}

function SpecialOfferBuyNow({
  product,
  onBuyNow,
  sx,
  ...other
}: SpecialOfferBuyNowProps) {
  return (
    <Stack spacing={3} alignItems="flex-start" {...other}>
      <Stack spacing={1}>
        <Typography variant="h4">{product.name}</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {product.description}
        </Typography>
      </Stack>

      {product.colors && product.colors.length > 0 && (
        <Stack spacing={2}>
          <Typography variant="subtitle2">Available Colors</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {product.colors.join(', ')}
          </Typography>
        </Stack>
      )}

      {product.sizes && product.sizes.length > 0 && (
        <Stack spacing={2}>
          <Typography variant="subtitle2">Available Sizes</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {product.sizes.join(', ')}
          </Typography>
        </Stack>
      )}

      <Button size="large" color="inherit" variant="contained" onClick={onBuyNow}>
        Buy Now
      </Button>
    </Stack>
  );
}
