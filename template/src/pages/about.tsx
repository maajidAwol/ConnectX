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
          About ConnectX
        </Typography>

        <Typography variant="body1" sx={{ mb: 5 }}>
          ConnectX is Ethiopia's premier e-commerce platform, headquartered in the vibrant city of Addis Ababa. 
          We are dedicated to transforming the way Ethiopians shop and do business online, bringing together 
          local merchants and customers in a seamless digital marketplace.
        </Typography>

        <Grid container spacing={4} sx={{ mb: 5 }}>
          <Grid item xs={12} md={4}>
            <Card elevation={4} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 2, color: 'primary.dark', fontWeight: 'bold' }}>
                  Our Mission
                </Typography>
                <Typography variant="body1">
                  To empower Ethiopian businesses and consumers through innovative e-commerce solutions, 
                  fostering economic growth and digital inclusion across the nation.
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
                  To become Ethiopia's leading digital commerce platform, connecting millions of 
                  merchants and customers while driving the country's digital transformation.
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
                  Innovation, Integrity, Customer Focus, and Community Impact guide everything we do 
                  at ConnectX, as we work to build a stronger digital economy for Ethiopia.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Typography variant="h3" sx={{ mb: 3 }}>
          Why Choose ConnectX?
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Local Expertise
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Deep understanding of Ethiopian market dynamics and consumer preferences, 
              with a focus on serving the unique needs of Addis Ababa and beyond.
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Secure Platform
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              State-of-the-art security measures to protect both merchants and customers, 
              ensuring safe and reliable transactions.
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Wide Selection
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Access to thousands of local and international products, from traditional 
              Ethiopian goods to modern necessities.
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Customer Support
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Dedicated support team available in multiple languages, including Amharic and English, 
              to assist you with any questions or concerns.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
