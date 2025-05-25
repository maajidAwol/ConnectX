// @mui
import { Stack, StackProps, Link } from '@mui/material';
// next
import NextLink from 'next/link';
// routes
import { paths } from 'src/routes/paths';
// types
import { IProductItemProps } from 'src/types/product';
// components
import Image from 'src/components/image';
import TextMaxLine from 'src/components/text-max-line';
//
import { ProductPrice } from '../../components';

// ----------------------------------------------------------------------

interface Props extends StackProps {
  product: IProductItemProps;
}

export default function EcommerceProductItemBestSellers({ product, sx, ...other }: Props) {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        '&:hover': {
          '& .cover': {
            opacity: 0.8,
          },
        },
        ...sx,
      }}
      {...other}
    >
      <Image
        alt={product.name}
        src={product.cover_url}
        sx={{
          width: 80,
          height: 80,
          flexShrink: 0,
          borderRadius: 1,
          cursor: 'pointer',
          transition: (theme) => theme.transitions.create('opacity'),
        }}
        className="cover"
      />

      <Stack spacing={0.5} flexGrow={1}>
        <Link component={NextLink} href={`${paths.eCommerce.product}?id=${product.id}`} color="inherit">
          <TextMaxLine variant="subtitle2" line={1}>
            {product.name}
          </TextMaxLine>
        </Link>

        <TextMaxLine variant="caption" line={1} sx={{ color: 'text.disabled' }}>
          {product.category.name}
        </TextMaxLine>

        <ProductPrice 
          price={Number(product.base_price)} 
          priceSale={product.selling_price ? Number(product.selling_price) : undefined} 
        />
      </Stack>
    </Stack>
  );
}
