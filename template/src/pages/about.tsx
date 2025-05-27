// next
import Head from 'next/head';
// @mui
import { Container, Typography, Box, Grid, Card, CardContent } from '@mui/material';
// layouts
import MainLayout from 'src/layouts/main';
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// routes
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

AboutPage.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>;

// ----------------------------------------------------------------------

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us | ConnectX</title>
      </Head>

      <Box
        sx={{
          pt: 6,
          pb: 1,
          bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'grey.800'),
        }}
      >
        <Container>
          <CustomBreadcrumbs
            heading="About Us"
            links={[
              { name: 'Home', href: '/' },
              { name: 'About Us' },
            ]}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10, bgcolor: 'background.neutral', borderRadius: 3, boxShadow: 3, py: 6 }}>
        <Typography variant="h2" sx={{ mb: 5, fontWeight: 'bold', color: 'primary.main' }}>
          About Our E-commerce Platform
        </Typography>

        <Typography variant="body1" sx={{ mb: 5 }}>
          Our e-commerce platform is powered by ConnectX's robust centralized backend system, providing 
          a seamless and secure shopping experience. We offer a comprehensive marketplace where customers 
          can discover, shop, and enjoy a wide range of products with confidence.
        </Typography>

        <Grid container spacing={4} sx={{ mb: 5 }}>
          <Grid item xs={12} md={4}>
            <Card elevation={4} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 2, color: 'primary.dark', fontWeight: 'bold' }}>
                  Our Mission
                </Typography>
                <Typography variant="body1">
                  To provide a seamless and secure e-commerce experience, leveraging ConnectX's powerful 
                  backend infrastructure to deliver exceptional service to our customers.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Our Vision
                </Typography>
                <Typography variant="body1">
                  To become the preferred e-commerce destination, offering a diverse range of products 
                  with reliable delivery and excellent customer service.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Our Values
                </Typography>
                <Typography variant="body1">
                  Customer satisfaction, secure transactions, and reliable service are at the core of 
                  our e-commerce platform, backed by ConnectX's robust infrastructure.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Typography variant="h3" sx={{ mb: 3 }}>
          Why Choose Our Platform?
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Secure Shopping
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Powered by ConnectX's secure backend, we ensure safe transactions and protect your 
              personal information with state-of-the-art security measures.
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Wide Selection
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Browse through thousands of products across various categories, all managed through 
              our efficient e-commerce system.
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Fast Delivery
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Enjoy quick and reliable delivery services, with real-time tracking powered by 
              ConnectX's integrated logistics system.
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Customer Support
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Our dedicated support team is available to assist you with any questions about 
              products, orders, or technical issues.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
