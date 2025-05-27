import Head from 'next/head';
// @mui
import { Container, Typography, Box, Grid, Card, CardContent, Button, Stack, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
// layouts
import MainLayout from 'src/layouts/main';
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
// routes
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

MerchantPage.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>;

// ----------------------------------------------------------------------

export default function MerchantPage() {
  return (
    <>
      <Head>
        <title>Become a Merchant | ConnectX</title>
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
            heading="Become a Merchant"
            links={[
              { name: 'Home', href: '/' },
              { name: 'Become a Merchant' },
            ]}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10, bgcolor: 'background.neutral', borderRadius: 3, boxShadow: 3, py: 6 }}>
        <Typography variant="h2" sx={{ mb: 5, fontWeight: 'bold', color: 'primary.main' }}>
          Grow Your Business with ConnectX
        </Typography>

        <Typography variant="h5" sx={{ mb: 3 }}>
          Why Choose ConnectX?
        </Typography>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={4}>
            <Card elevation={4} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Stack spacing={2}>
                  <Iconify icon="carbon:growth" width={48} />
                  <Typography variant="h6" sx={{ color: 'primary.dark', fontWeight: 'bold' }}>Reach More Customers</Typography>
                  <Typography variant="body2">
                    Access our growing customer base in Addis Ababa and across Ethiopia. 
                    Expand your market reach and increase your sales potential.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Iconify icon="carbon:money" width={48} />
                  <Typography variant="h6">Competitive Commission</Typography>
                  <Typography variant="body2">
                    Enjoy one of the most competitive commission rates in the market. 
                    Keep more of your earnings while growing your business.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Iconify icon="carbon:delivery" width={48} />
                  <Typography variant="h6">Logistics Support</Typography>
                  <Typography variant="body2">
                    Benefit from our established logistics network. 
                    We handle delivery and ensure your products reach customers safely and on time.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Typography variant="h5" sx={{ mb: 3 }}>
          Requirements to Become a Merchant
        </Typography>

        <Card sx={{ mb: 8 }}>
          <CardContent>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Iconify icon="carbon:document" width={24} />
                </ListItemIcon>
                <ListItemText 
                  primary="Valid Business License" 
                  secondary="Must have a valid business license from the Ethiopian government"
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <Iconify icon="carbon:document-multiple" width={24} />
                </ListItemIcon>
                <ListItemText 
                  primary="Tax Registration" 
                  secondary="Must be registered for tax purposes with the Ethiopian Revenue and Customs Authority"
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <Iconify icon="carbon:image" width={24} />
                </ListItemIcon>
                <ListItemText 
                  primary="Product Images" 
                  secondary="High-quality images of your products (minimum 3 images per product)"
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <Iconify icon="carbon:bank" width={24} />
                </ListItemIcon>
                <ListItemText 
                  primary="Bank Account" 
                  secondary="Valid Ethiopian bank account for receiving payments"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        <Typography variant="h5" sx={{ mb: 3 }}>
          How to Apply
        </Typography>

        <Card sx={{ mb: 8 }}>
          <CardContent>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Iconify icon="carbon:number-1" width={24} />
                </ListItemIcon>
                <ListItemText 
                  primary="Complete Application" 
                  secondary="Fill out our merchant application form with your business details"
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <Iconify icon="carbon:number-2" width={24} />
                </ListItemIcon>
                <ListItemText 
                  primary="Submit Documents" 
                  secondary="Upload required business documents and product information"
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <Iconify icon="carbon:number-3" width={24} />
                </ListItemIcon>
                <ListItemText 
                  primary="Review Process" 
                  secondary="Our team will review your application within 3-5 business days"
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <Iconify icon="carbon:number-4" width={24} />
                </ListItemIcon>
                <ListItemText 
                  primary="Onboarding" 
                  secondary="Once approved, we'll help you set up your store and start selling"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="contained"
            size="large"
            color="primary"
            startIcon={<Iconify icon="carbon:add" />} 
            sx={{ px: 5, py: 1.5, fontWeight: 'bold', fontSize: 18, borderRadius: 3, boxShadow: 3 }}
            href="https://connect-x-peach.vercel.app/"
            target="_blank"
            rel="noopener"
          >
            Register as a Merchant
          </Button>
        </Box>
      </Container>
    </>
  );
} 