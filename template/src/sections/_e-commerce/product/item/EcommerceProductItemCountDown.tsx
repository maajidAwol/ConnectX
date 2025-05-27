import { add } from 'date-fns';
// next
import NextLink from 'next/link';
// @mui
import { Theme, alpha, useTheme } from '@mui/material/styles';
import { Typography, Stack, SxProps, Link, Paper, LinearProgress } from '@mui/material';
// utils
import { filterStyles } from 'src/utils/cssStyles';
import { fCurrency } from 'src/utils/formatNumber';
// routes
import { paths } from 'src/routes/paths';
// types
import { IProductItemProps } from 'src/types/product';
// theme
import { ColorSchema } from 'src/theme/palette';
// components
import Image from 'src/components/image';
import TextMaxLine from 'src/components/text-max-line';
//
import { ProductCountdownBlock, ProductPrice } from '../../components';

// ----------------------------------------------------------------------

type Props = {
  product: IProductItemProps;
  color?: 'primary' | 'secondary';
  sx?: SxProps<Theme>;
};

export default function EcommerceProductItemCountDown({ product, color = 'primary', sx }: Props) {
  const theme = useTheme();
  const PLACEHOLDER_IMAGE = '/assets/placeholder.jpg';

  const coverImg = product.coverImg && !product.coverImg.includes('example.com') 
    ? product.coverImg 
    : PLACEHOLDER_IMAGE;

  return (
    <Link component={NextLink} href={`${paths.eCommerce.product}/${product.id}`} color="inherit" underline="none">
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: 'background.default',
          transition: (theme) =>
            theme.transitions.create('background-color', {
              easing: theme.transitions.easing.easeIn,
              duration: theme.transitions.duration.shortest,
            }),
          '&:hover': {
            bgcolor: 'background.neutral',
          },
          ...sx,
        }}
      >
        <Image
          src={coverImg}
          sx={{
            mb: 2,
            borderRadius: 1.5,
            bgcolor: 'background.neutral',
          }}
        />

        <Stack spacing={0.5}>
          <TextMaxLine variant="body2" line={1} sx={{ fontWeight: 'fontWeightMedium' }}>
            {product.name}
          </TextMaxLine>

          <ProductPrice
            price={product.price}
            priceSale={product.priceSale}
            sx={{
              typography: 'h6',
            }}
          />

          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              available
            </Typography>

            <Typography variant="caption">{product.inStock}</Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={(product.sold / product.inStock) * 100}
            color={color}
          />
        </Stack>
      </Paper>
    </Link>
  );
}
