import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
// @mui
import { styled, alpha, Theme } from '@mui/material/styles';
import {
  Input,
  Slide,
  Button,
  SxProps,
  IconButton,
  InputAdornment,
  ClickAwayListener,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Box,
  Typography,
  Stack,
} from '@mui/material';
// config
import { HEADER } from 'src/config-global';
// components
import Iconify from 'src/components/iconify';
import Image from 'src/components/image';
// store
import { useProductStore } from 'src/store/product';
// routes
import { paths } from 'src/routes/paths';
// utils
import debounce from 'lodash/debounce';

// ----------------------------------------------------------------------

// Cache interface
interface SearchCache {
  [key: string]: {
    results: any[];
    timestamp: number;
  };
}

// Cache expiration time (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000;

const StyledSearchbar = styled('div')(({ theme }) => ({
  top: 0,
  left: 0,
  zIndex: 99,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  justifyContent: 'center',
  height: HEADER.H_MOBILE,
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  padding: theme.spacing(0, 3),
  boxShadow: theme.customShadows.z8,
  backgroundColor: `${alpha(theme.palette.background.default, 0.72)}`,
  [theme.breakpoints.up('md')]: {
    height: HEADER.H_MAIN_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

const StyledSearchResults = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 99,
  width: '100%',
  maxWidth: 600,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.customShadows.z8,
  borderRadius: theme.shape.borderRadius,
  maxHeight: 400,
  overflowY: 'auto',
}));

const StyledSearchInput = styled(Input)(({ theme }) => ({
  width: '100%',
  maxWidth: 600,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1, 2),
  '& .MuiInput-input': {
    padding: theme.spacing(1, 0),
  },
}));

// ----------------------------------------------------------------------

type SearchbarProps = {
  sx?: SxProps<Theme>;
};

export default function Searchbar({ sx }: SearchbarProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchProducts } = useProductStore();

  // Initialize cache
  const [searchCache, setSearchCache] = useState<SearchCache>({});

  // Memoize the debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        if (query.length < 2) {
          setSearchResults([]);
          return;
        }

        // Check cache first
        const cachedResults = searchCache[query];
        if (cachedResults && Date.now() - cachedResults.timestamp < CACHE_EXPIRATION) {
          setSearchResults(cachedResults.results);
          return;
        }

        setIsLoading(true);
        try {
          const response = await fetchProducts(1, 'listed', null, 'latest', query);
          const results = response?.results || [];
          
          // Filter results to match query in name, category, or description
          const filteredResults = results.filter((product) => {
            const searchStr = query.toLowerCase();
            return (
              product.name.toLowerCase().includes(searchStr) ||
              product.category?.name.toLowerCase().includes(searchStr) ||
              product.description?.toLowerCase().includes(searchStr)
            );
          });

          // Update cache
          setSearchCache((prev) => ({
            ...prev,
            [query]: {
              results: filteredResults,
              timestamp: Date.now(),
            },
          }));

          setSearchResults(filteredResults);
        } catch (error) {
          console.error('Error searching products:', error);
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 300),
    [fetchProducts, searchCache]
  );

  // Clean up cache periodically
  useEffect(() => {
    const cleanupCache = () => {
      const now = Date.now();
      setSearchCache((prev) => {
        const newCache = { ...prev };
        Object.keys(newCache).forEach((key) => {
          if (now - newCache[key].timestamp > CACHE_EXPIRATION) {
            delete newCache[key];
          }
        });
        return newCache;
      });
    };

    const interval = setInterval(cleanupCache, CACHE_EXPIRATION);
    return () => clearInterval(interval);
  }, []);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleProductClick = (productId: string) => {
    router.push(`${paths.eCommerce.product}?id=${productId}`);
    handleClose();
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        <IconButton 
          color="inherit" 
          aria-label="search" 
          onClick={handleOpen} 
          sx={{
            ...sx,
            '&:hover': {
              bgcolor: 'primary.lighter',
            },
          }}
        >
          <Iconify icon="carbon:search" />
        </IconButton>

        <Slide direction="down" in={open} mountOnEnter unmountOnExit>
          <StyledSearchbar>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%', maxWidth: 600 }}>
              <StyledSearchInput
                autoFocus
                fullWidth
                disableUnderline
                placeholder="Search products by name, category, or description..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <Iconify icon="carbon:search" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                }
                endAdornment={
                  isLoading && (
                    <InputAdornment position="end">
                      <Iconify icon="eos-icons:loading" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  )
                }
                sx={{ mr: 1, fontWeight: 'fontWeightBold' }}
              />
              <Button 
                variant="contained" 
                onClick={handleClose}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                Cancel
              </Button>
            </Stack>

            {searchResults.length > 0 && (
              <StyledSearchResults>
                <List>
                  {searchResults.map((product) => (
                    <ListItem
                      key={product.id}
                      button
                      onClick={() => handleProductClick(product.id)}
                      sx={{ 
                        py: 1.5,
                        '&:hover': {
                          bgcolor: 'primary.lighter',
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          alt={product.name}
                          src={product.cover_url}
                          variant="rounded"
                          sx={{ width: 48, height: 48 }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" noWrap>
                            {product.name}
                          </Typography>
                        }
                        secondary={
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              {product.category?.name}
                            </Typography>
                            <Typography variant="caption" color="primary.main" sx={{ fontWeight: 'bold' }}>
                              ${product.base_price}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </StyledSearchResults>
            )}
          </StyledSearchbar>
        </Slide>
      </div>
    </ClickAwayListener>
  );
}
