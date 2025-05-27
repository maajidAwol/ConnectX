import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Typography, Container, Stack } from '@mui/material';
// components
import Image from 'src/components/image';
import TextMaxLine from 'src/components/text-max-line';
// api
import { apiRequest } from 'src/lib/api-config';

// ----------------------------------------------------------------------

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const MOCK_CATEGORIES = [
  { label: 'Watches', icon: '/assets/icons/e-commerce/ic_watches.svg' },
  { label: 'Home Appliances', icon: '/assets/icons/e-commerce/ic_home_appliances.svg' },
  { label: 'Sport & Outdoor', icon: '/assets/icons/e-commerce/ic_sport.svg' },
  { label: 'Books & Stationery', icon: '/assets/icons/e-commerce/ic_book.svg' },
  { label: 'Home & Living', icon: '/assets/icons/e-commerce/ic_home_living.svg' },
  { label: 'Health', icon: '/assets/icons/e-commerce/ic_health.svg' },
];

// ----------------------------------------------------------------------

export default function EcommerceLandingCategories() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiRequest('/products/listed-categories/', {
          method: 'GET',
        });
        
        if (response && 'results' in response) {
          setCategories(response.results);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = () => {
    router.push('/e-commerce/products');
  };

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
        Categories
      </Typography>

      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(4, 1fr)',
          md: 'repeat(6, 1fr)',
        }}
      >
        {/* Real Categories */}
        {categories.map((category) => (
          <Stack
            key={category.id}
            alignItems="center"
            justifyContent="center"
            onClick={handleCategoryClick}
            sx={{
              px: 1,
              py: 3,
              borderRadius: 2,
              cursor: 'pointer',
              border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.24)}`,
              '&:hover': {
                boxShadow: (theme) => `0 0 0 2px ${theme.palette.text.primary}`,
              },
            }}
          >
            <Box sx={{ mb: 2, p: 1.5, bgcolor: 'background.neutral', borderRadius: '50%' }}>
              <Image 
                src={category.icon || '/assets/icons/e-commerce/ic_electronics.svg'} 
                alt={category.name}
                sx={{ width: 40, height: 40 }} 
              />
            </Box>

            <TextMaxLine variant="subtitle2" line={1}>
              {category.name}
            </TextMaxLine>
          </Stack>
        ))}

        {/* Mock Categories */}
        {MOCK_CATEGORIES.map((category) => (
          <Stack
            key={category.label}
            alignItems="center"
            justifyContent="center"
            onClick={handleCategoryClick}
            sx={{
              px: 1,
              py: 3,
              borderRadius: 2,
              cursor: 'pointer',
              border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.24)}`,
              '&:hover': {
                boxShadow: (theme) => `0 0 0 2px ${theme.palette.text.primary}`,
              },
            }}
          >
            <Box sx={{ mb: 2, p: 1.5, bgcolor: 'background.neutral', borderRadius: '50%' }}>
              <Image src={category.icon} sx={{ width: 40, height: 40 }} />
            </Box>

            <TextMaxLine variant="subtitle2" line={1}>
              {category.label}
            </TextMaxLine>
          </Stack>
        ))}
      </Box>
    </Container>
  );
}
