import { useState, useEffect } from 'react';
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

// ----------------------------------------------------------------------

const StyledSearchbar = styled('div')(({ theme }) => ({
  top: 0,
  left: 0,
  zIndex: 99,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  height: HEADER.H_MOBILE,
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
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
  left: 0,
  right: 0,
  zIndex: 99,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.customShadows.z8,
  borderRadius: theme.shape.borderRadius,
  maxHeight: 400,
  overflowY: 'auto',
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
  const { fetchProducts } = useProductStore();

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      try {
        const response = await fetchProducts(1, 'listed', null, 'latest', query);
        setSearchResults(response?.results || []);
      } catch (error) {
        console.error('Error searching products:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleProductClick = (productId: string) => {
    router.push(`${paths.eCommerce.product}?id=${productId}`);
    handleClose();
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        <IconButton color="inherit" aria-label="search" onClick={handleOpen} sx={sx}>
          <Iconify icon="carbon:search" />
        </IconButton>

        <Slide direction="down" in={open} mountOnEnter unmountOnExit>
          <StyledSearchbar>
            <Input
              autoFocus
              fullWidth
              disableUnderline
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <Iconify icon="carbon:search" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              }
              sx={{ mr: 1, fontWeight: 'fontWeightBold' }}
            />
            <Button variant="contained" onClick={handleClose}>
              Cancel
            </Button>

            {searchResults.length > 0 && (
              <StyledSearchResults>
                <List>
                  {searchResults.map((product) => (
                    <ListItem
                      key={product.id}
                      button
                      onClick={() => handleProductClick(product.id)}
                      sx={{ py: 1.5 }}
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
                        primary={product.name}
                        secondary={
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              {product.category.name}
                            </Typography>
                            <Typography variant="caption" color="primary.main">
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
