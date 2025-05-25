// @mui
import { Stack, StackProps } from '@mui/material';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

interface Category {
  id: string;
  name: string;
  icon: string | null;
  description: string;
}

interface Props extends StackProps {
  options: Category[];
  filterCategories: string;
  onChangeCategories: (categoryId: string) => void;
}

export default function EcommerceFilterCategory({
  options,
  filterCategories,
  onChangeCategories,
  ...other
}: Props) {
  return (
    <Stack spacing={1} alignItems="flex-start" {...other}>
      {options.map((category) => (
        <Stack
          key={category.id}
          direction="row"
          alignItems="center"
          onClick={(e) => {
            e.preventDefault();
            onChangeCategories(category.id);
          }}
          sx={{
            typography: 'body2',
            cursor: 'pointer',
            ...(filterCategories === category.id && {
              fontWeight: 'fontWeightBold',
            }),
          }}
        >
          <Iconify icon="carbon:chevron-right" width={12} sx={{ mr: 1 }} />
          {category.name}
        </Stack>
      ))}
    </Stack>
  );
}
