// next
import Head from 'next/head';
import NextLink from 'next/link';
// @mui
import { Box, Container, Link, Paper, Typography, Divider } from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
// layouts
import MainLayout from 'src/layouts/main';

// ----------------------------------------------------------------------

interface ComponentItem {
  title: string;
  path: string;
}

const ITEMS: ComponentItem[] = [
];

// ----------------------------------------------------------------------

ComponentsPage.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>;

// ----------------------------------------------------------------------

export default function ComponentsPage() {
  return (
    <>
      <Head>
        <title>ConnectX</title>
      </Head>

      <Container sx={{ mt: 5, mb: 10 }}>
        <Typography variant="h4" paragraph>
          MUI Components
        </Typography>

        <Link href="https://mui.com/components/" target="_blank" rel="noopener">
          https://mui.com/components/
        </Link>

        <Divider sx={{ borderStyle: 'dashed', my: 5 }} />

        <Typography variant="h4" paragraph>
          Extra Components
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 5 }}>
          Extension components and 3rd party dependencies.
        </Typography>

        <Box
          gap={3}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          }}
        >
          {ITEMS.map((item) => (
            <Link
              component={NextLink}
              href={item.path}
              key={item.title}
              color="inherit"
              underline="none"
            >
              <Paper
                variant="outlined"
                sx={{
                  px: 3,
                  py: 5,
                  typography: 'h6',
                  borderRadius: 1.5,
                  textAlign: 'center',
                  '&:hover': {
                    boxShadow: (theme) => `0 0 0 2px ${theme.palette.text.primary}`,
                  },
                }}
              >
                {item.title}
              </Paper>
            </Link>
          ))}
        </Box>
      </Container>
    </>
  );
}
