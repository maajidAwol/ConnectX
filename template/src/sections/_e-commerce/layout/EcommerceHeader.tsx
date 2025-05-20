// @mui
import { Box, Container, Stack, IconButton } from '@mui/material';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
// store
import { useCartStore } from 'src/store/cart';
//
import { EcommerceCartPopover } from '../cart';

// ----------------------------------------------------------------------

export function EcommerceHeader() {
  const settings = useSettingsContext();

  return (
    <Box
      sx={{
        bgcolor: 'background.neutral',
      }}
    >
      <Container
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: { xs: 64, md: 72 },
        }}
      >
        <IconButton
          size="small"
          onClick={() => settings.onToggleMode()}
          sx={{ mr: 1, color: 'text.primary' }}
        >
          <Iconify icon={settings.themeMode === 'dark' ? 'carbon:asleep' : 'carbon:asleep-filled'} />
        </IconButton>

        <Stack
          direction="row"
          alignItems="center"
          spacing={{ xs: 1, md: 2 }}
          flexGrow={1}
          sx={{ ml: 2 }}
        >
          <EcommerceCartPopover />
        </Stack>
      </Container>
    </Box>
  );
} 