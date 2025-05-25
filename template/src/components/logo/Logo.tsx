import { memo } from 'react';
// next
import NextLink from 'next/link';
// @mui
import { Box, BoxProps, Link, useTheme } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

interface LogoProps extends BoxProps {
  isFooter?: boolean;
  disabledLink?: boolean;
}

const StyledLogo = styled(Box)(({ theme }) => ({
  transition: theme.transitions.create(['transform', 'opacity', 'filter'], {
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    transform: 'scale(1.05)',
    opacity: 0.9,
    filter: theme.palette.mode === 'dark' ? 'brightness(1.2)' : 'none',
  },
}));

function Logo({ sx, isFooter = false, disabledLink = false }: LogoProps) {
  const theme = useTheme();
  const logoPath = '/assets/logo/logo.png';  
  // Responsive sizes based on viewport
  const logoSize = {
    xs: isFooter ? '40px' : '60px',
    sm: isFooter ? '50px' : '70px',
    md: isFooter ? '60px' : '90px',
  };

  const logo = (
    <StyledLogo
      sx={{
        width: logoSize,
        height: logoSize,
        lineHeight: 0,
        cursor: 'pointer',
        display: 'inline-flex',
        position: 'relative',
        ...sx,
      }}
    >
      <img 
        src={logoPath} 
        alt="logo" 
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: theme.palette.mode === 'dark' ? 'brightness(1.2)' : 'none',
        }}
      />
    </StyledLogo>
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link
      component={NextLink}
      href="/"
      color="inherit"
      aria-label="go to homepage"
      sx={{ lineHeight: 0 }}
    >
      {logo}
    </Link>
  );
}

export default memo(Logo);
