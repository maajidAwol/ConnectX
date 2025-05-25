import Head from 'next/head';
// @mui
import { Container, Typography, Box, Grid, Card, CardContent, TextField, Button, Stack } from '@mui/material';
// layouts
import MainLayout from 'src/layouts/main';
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
// routes
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

ContactPage.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>;

// ----------------------------------------------------------------------

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact Us | ConnectX</title>
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
            heading="Contact Us"
            links={[
              { name: 'Home', href: '/' },
              { name: 'Contact Us' },
            ]}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10, bgcolor: 'background.neutral', borderRadius: 3, boxShadow: 3, py: 6 }}>
        <Typography variant="h2" sx={{ mb: 5, fontWeight: 'bold', color: 'primary.main' }}>
          Get in Touch
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card elevation={4} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 3, color: 'primary.dark', fontWeight: 'bold' }}>
                  Contact Information
                </Typography>

                <Stack spacing={3}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Iconify icon="carbon:location" width={24} />
                    <Typography variant="body1">
                      Bole, Addis Ababa, Ethiopia
                      <br />
                      Near Bole International Airport
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <Iconify icon="carbon:phone" width={24} />
                    <Typography variant="body1">
                      +251 911 123 456
                      <br />
                      +251 922 123 456
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <Iconify icon="carbon:email" width={24} />
                    <Typography variant="body1">
                      info@connectx.et
                      <br />
                      support@connectx.et
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <Iconify icon="carbon:time" width={24} />
                    <Typography variant="body1">
                      Monday - Friday: 8:00 AM - 6:00 PM
                      <br />
                      Saturday: 9:00 AM - 4:00 PM
                      <br />
                      Sunday: Closed
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 3 }}>
                  Send us a Message
                </Typography>

                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Name"
                    variant="outlined"
                  />

                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                  />

                  <TextField
                    fullWidth
                    label="Phone"
                    variant="outlined"
                  />

                  <TextField
                    fullWidth
                    label="Message"
                    multiline
                    rows={4}
                    variant="outlined"
                  />

                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Iconify icon="carbon:send" />}
                  >
                    Send Message
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 5 }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Our Location
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Visit our headquarters in Addis Ababa:
          </Typography>
          <Typography variant="body1">
            Located in the heart of Bole, our office is easily accessible from Bole International Airport 
            and major business districts. We welcome visitors during our business hours for any inquiries 
            or support needs.
          </Typography>
        </Box>
      </Container>
    </>
  );
} 