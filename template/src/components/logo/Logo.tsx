import { memo } from 'react';
// next
import NextLink from 'next/link';
import Image from 'next/image';
// @mui
import { Box, BoxProps, Link } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

interface LogoProps extends BoxProps {
  isFooter?: boolean;
}

const StyledLogo = styled(Box)(({ theme }) => ({
  transition: theme.transitions.create(['transform', 'opacity'], {
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    transform: 'scale(1.05)',
    opacity: 0.9,
  },
}));

function Logo({ sx, isFooter = false }: LogoProps) {
  const logoPath = '/assets/logo/logo.svg';
  const logoSize = isFooter ? 60 : 90; // Smaller size for footer

  return (
    <Link
      component={NextLink}
      href="/"
      color="inherit"
      aria-label="go to homepage"
      sx={{ lineHeight: 0 }}
    >
      <StyledLogo
        sx={{
          width: logoSize,
          height: logoSize,
          lineHeight: 0,
          cursor: 'pointer',
          display: 'inline-flex',
          ...sx,
        }}
      >
        <Image 
          src={logoPath} 
          alt="logo" 
          width={logoSize} 
          height={logoSize}
          style={{
            objectFit: 'contain',
          }}
        />
      </StyledLogo>
    </Link>
  );
}

export default memo(Logo);
