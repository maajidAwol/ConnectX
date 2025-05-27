// next
import NextLink from 'next/link';
// @mui
import { Stack, StackProps, Link, Fab } from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
// types
import { IProductItemProps } from 'src/types/product';
// components
import Label from 'src/components/label';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import TextMaxLine from 'src/components/text-max-line';
// store
import { useCartStore } from 'src/store/cart';
//
import { ProductRating, ProductPrice } from '../../components';

// ----------------------------------------------------------------------

interface Props extends StackProps {
  product: IProductItemProps;
}

export default function EcommerceProductViewListItem({ product, ...other }: Props) {
  const { addItem } = useCartStore();
  
  // Add null check for product
  if (!product || !product.id) {
    return null; // or return a loading/error state
  }

  const isNew = new Date(product.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days
  const isSale = product.selling_price && Number(product.selling_price) < Number(product.base_price);

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.base_price),
      quantity: 1,
      cover_url: product.cover_url,
      colors: product.colors,
      sizes: product.sizes,
      category: product.category.name,
      color: product.colors[0],
    });
  };

  return (
    <Stack
      direction="row"
      sx={{
        position: 'relative',
        '&:hover .add-to-cart': {
          opacity: 1,
        },
      }}
      {...other}
    >
      {isNew && (
        <Label color="info" sx={{ position: 'absolute', m: 1, top: 0, left: 0, zIndex: 9 }}>
          NEW
        </Label>
      )}

      {isSale && (
        <Label color="error" sx={{ position: 'absolute', m: 1, top: 0, left: 0, zIndex: 9 }}>
          SALE
        </Label>
      )}

      {product.id && (
        <Link
          component={NextLink}
          href={`${paths.eCommerce.product}?id=${product.id}`}
          sx={{ display: 'block' }}
        >
          <Image
            src={product.cover_url}
            alt={product.name}
            sx={{
              mr: 2,
              width: 160,
              flexShrink: 0,
              borderRadius: 1.5,
              bgcolor: 'background.neutral',
            }}
          />
        </Link>
      )}

      <Fab
        className="add-to-cart"
        color="primary"
        size="medium"
        onClick={handleAddToCart}
        sx={{
          right: 8,
          zIndex: 9,
          top: 8,
          opacity: 0,
          position: 'absolute',
          transition: (theme) =>
            theme.transitions.create('opacity', {
              easing: theme.transitions.easing.easeIn,
              duration: theme.transitions.duration.shortest,
            }),
        }}
      >
        <Iconify icon="carbon:shopping-cart-plus" />
      </Fab>

      <Stack spacing={0.5} flexGrow={1}>
        <TextMaxLine variant="caption" line={1} sx={{ color: 'text.disabled' }}>
          {product.category.name}
        </TextMaxLine>

        {product.id && (
          <Link 
            component={NextLink} 
            href={`${paths.eCommerce.product}?id=${product.id}`} 
            color="inherit"
          >
            <TextMaxLine variant="h6" line={1}>
              {product.name}
            </TextMaxLine>
          </Link>
        )}

        <ProductRating 
          rating={product.total_ratings / (product.total_reviews || 1)} 
          label={`${product.total_sold} sold`} 
        />

        <TextMaxLine variant="body2" line={1} sx={{ color: 'text.secondary' }}>
          {product.short_description}
        </TextMaxLine>

        <ProductPrice
          price={Number(product.base_price)}
          priceSale={product.selling_price ? Number(product.selling_price) : undefined}
          sx={{ typography: 'h6' }}
        />
      </Stack>
    </Stack>
  );
}
