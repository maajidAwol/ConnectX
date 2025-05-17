// next
import NextLink from 'next/link';
// @mui
import { Theme } from '@mui/material/styles';
import { Stack, Paper, Typography, LinearProgress, SxProps, Link, Box } from '@mui/material';
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

type Props = {
  product: IProductItemProps;
  hotProduct?: boolean;
  sx?: SxProps<Theme>;
};

export default function EcommerceProductItemHot({ product, hotProduct = false, sx }: Props) {
  const PLACEHOLDER_IMAGE = '/assets/placeholder.jpg';

  const coverImg = product.coverImg && !product.coverImg.includes('example.com') 
    ? product.coverImg 
    : PLACEHOLDER_IMAGE;

  return (
    <Link component={NextLink} href={`${paths.eCommerce.product}/${product.id}`} color="inherit">
      <Box
        sx={{
          position: 'relative',
          transition: 'all .3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-8px)',
          },
        }}
      >
        <Image
          src={coverImg}
          sx={{
            mb: 2,
            borderRadius: 2,
            bgcolor: 'background.neutral',
          }}
        />

        <Stack spacing={0.5}>
          <TextMaxLine variant="caption" line={1} sx={{ color: 'text.disabled' }}>
            {product.category}
          </TextMaxLine>

          <TextMaxLine variant="body2" line={1} sx={{ fontWeight: 'fontWeightMedium' }}>
            {product.name}
          </TextMaxLine>

          <ProductPrice
            price={product.price}
            priceSale={product.priceSale}
            sx={{
              ...(hotProduct && {
                color: 'error.main',
              }),
            }}
          />
        </Stack>

        {hotProduct && (
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
            <LinearProgress
              color="inherit"
              variant="determinate"
              value={(product.sold / product.inStock) * 100}
              sx={{ width: 1 }}
            />

            <Typography
              variant="caption"
              sx={{ flexShrink: 0, color: 'text.disabled' }}
            >{`🔥 ${product.sold} Sold`}</Typography>
          </Stack>
        )}
      </Box>
    </Link>
  );
}
