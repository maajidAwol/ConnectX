// next
import NextLink from 'next/link';
// @mui
import { alpha } from '@mui/material/styles';
import {
  Link,
  Stack,
  Drawer,
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';
// hooks
import useResponsive from 'src/hooks/useResponsive';
import useActiveLink from 'src/hooks/useActiveLink';
// config
import { NAV } from 'src/config-global';
// routes
import { paths } from 'src/routes/paths';
// store
import { useAuthStore } from 'src/store/auth';
// components
import Iconify from 'src/components/iconify';
import TextMaxLine from 'src/components/text-max-line';

// ----------------------------------------------------------------------

const navigations = [
  {
    title: 'Personal Info',
    path: paths.eCommerce.account.personal,
    icon: <Iconify icon="carbon:user" />,
  },
  {
    title: 'Orders',
    path: paths.eCommerce.account.orders,
    icon: <Iconify icon="carbon:document" />,
  },
  {
    title: 'Wishlist',
    path: paths.eCommerce.account.wishlist,
    icon: <Iconify icon="carbon:favorite" />,
  },
  {
    title: 'Vouchers',
    path: paths.eCommerce.account.vouchers,
    icon: <Iconify icon="carbon:cut-out" />,
  },
  {
    title: 'Payment',
    path: paths.eCommerce.account.payment,
    icon: <Iconify icon="carbon:purchase" />,
  },
];

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
};

export default function EcommerceAccountMenu({ open, onClose }: Props) {
  const isMdUp = useResponsive('up', 'md');
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  const renderContent = (
    <Stack
      sx={{
        flexShrink: 0,
        borderRadius: 2,
        width: 1,
        ...(isMdUp && {
          width: NAV.W_DRAWER,
          border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.24)}`,
        }),
      }}
    >
      <Stack spacing={2} sx={{ p: 3, pb: 2 }}>
        <Stack spacing={2} direction="row" alignItems="center">
          <Avatar 
            src={user.avatar_url || undefined}
            alt={user.name}
            sx={{ width: 64, height: 64 }}
          >
            {user.name.charAt(0)}
          </Avatar>
        </Stack>

        <Stack spacing={0.5}>
          <TextMaxLine variant="subtitle1" line={1}>
            {user.name}
          </TextMaxLine>
          <TextMaxLine variant="body2" line={1} sx={{ color: 'text.secondary' }}>
            {user.email}
          </TextMaxLine>
        </Stack>
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Stack sx={{ my: 1, px: 2 }}>
        {navigations.map((item) => (
          <MenuItem key={item.title} item={item} />
        ))}
      </Stack>
    </Stack>
  );

  return (
    <>
      {isMdUp ? (
        renderContent
      ) : (
        <Drawer
          open={open}
          onClose={onClose}
          ModalProps={{ keepMounted: true }}
          PaperProps={{
            sx: {
              width: NAV.W_DRAWER,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

type MenuItemProps = {
  item: {
    title: string;
    path: string;
    icon: React.ReactNode;
  };
};

function MenuItem({ item }: MenuItemProps) {
  const { active } = useActiveLink(item.path);

  return (
    <Link
      component={NextLink}
      key={item.title}
      href={item.path}
      color={active ? 'primary' : 'inherit'}
      underline="none"
    >
      <ListItemButton
        sx={{
          px: 1,
          height: 44,
          borderRadius: 1,
        }}
      >
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText
          primary={item.title}
          primaryTypographyProps={{
            typography: 'body2',
            ...(active && {
              typography: 'subtitle2',
            }),
          }}
        />
      </ListItemButton>
    </Link>
  );
}
