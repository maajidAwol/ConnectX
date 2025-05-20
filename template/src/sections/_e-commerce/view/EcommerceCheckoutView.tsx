import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// next
import { useRouter } from 'next/router';
// @mui
import {
  Box,
  Stack,
  Button,
  Divider,
  Collapse,
  Container,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form';
// store
import { useCartStore } from 'src/store/cart';
import { useAuthStore } from 'src/store/auth';
// api
import { apiRequest } from 'src/lib/api-config';
//
import { EcommerceHeader } from '../layout';
import {
  EcommerceCheckoutNewCardForm,
  EcommerceCheckoutOrderSummary,
  EcommerceCheckoutPaymentMethod,
  EcommerceCheckoutShippingMethod,
  EcommerceCheckoutPersonalDetails,
  EcommerceCheckoutShippingDetails,
} from '../checkout';

// ----------------------------------------------------------------------

interface ShippingAddress {
  id: string;
  label: string;
  full_address: string;
  phone_number: string;
  is_default: boolean;
}

interface UserDetails {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
}

const SHIPPING_OPTIONS = [
  {
    label: 'Free',
    value: 'free',
    description: '5-7 Days delivery',
    price: 0,
  },
  {
    label: 'Standard',
    value: 'standard',
    description: '3-5 Days delivery',
    price: 10,
  },
  {
    label: 'Express',
    value: 'express',
    description: '2-3 Days delivery',
    price: 20,
  },
];

const PAYMENT_OPTIONS = [
  {
    label: 'Paypal',
    value: 'paypal',
    description: '**** **** **** 1234',
  },
  {
    label: 'MasterCard',
    value: 'mastercard',
    description: '**** **** **** 3456',
  },
  {
    label: 'Visa',
    value: 'visa',
    description: '**** **** **** 6789',
  },
];

// ----------------------------------------------------------------------

export default function EcommerceCheckoutView() {
  const { replace } = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user, accessToken } = useAuthStore();
  const [shippingAddresses, setShippingAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.id && accessToken) {
      fetchUserDetails();
      fetchShippingAddresses();
    }
  }, [user?.id, accessToken]);

  const fetchUserDetails = async () => {
    try {
      const response = await apiRequest(`/users/${user?.id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response) {
        setUserDetails(response as UserDetails);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchShippingAddresses = async () => {
    try {
      const response = await apiRequest('/shipping-addresses/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response && typeof response === 'object' && 'results' in response && Array.isArray(response.results)) {
        const addresses = response.results as ShippingAddress[];
        setShippingAddresses(addresses);
        // Find default address or use first one
        const defaultAddress = addresses.find(addr => addr.is_default) || addresses[0];
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        }
      }
    } catch (error) {
      console.error('Error fetching shipping addresses:', error);
    }
  };

  const createShippingAddress = async (data: any) => {
    try {
      const response = await apiRequest('/shipping-addresses/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          label: data.label || 'Home',
          full_address: `${data.streetAddress}, ${data.city}, ${data.country}`,
          phone_number: data.phoneNumber,
          is_default: true,
        }),
      });
      
      if (response) {
        const newAddress = response as ShippingAddress;
        setShippingAddresses([...shippingAddresses, newAddress]);
        setSelectedAddress(newAddress);
        return newAddress;
      }
    } catch (error) {
      console.error('Error creating shipping address:', error);
      throw error;
    }
  };

  const EcommerceCheckoutSchema = Yup.object().shape({
    streetAddress: Yup.string().required('Street address is required'),
    city: Yup.string().required('City is required'),
    zipCode: Yup.string().required('Zip code is required'),
    country: Yup.string().required('Country is required'),
  });

  const defaultValues = {
    streetAddress: '',
    city: '',
    country: 'United States',
    zipCode: '',
  };

  const methods = useForm<typeof defaultValues>({
    resolver: yupResolver(EcommerceCheckoutSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: typeof defaultValues) => {
    try {
      setSubmitting(true);
      let addressId = selectedAddress?.id;
      
      // If no address is selected, create a new one
      if (!addressId) {
        const newAddress = await createShippingAddress(data);
        if (newAddress) {
          addressId = newAddress.id;
        } else {
          throw new Error('Failed to create shipping address');
        }
      }

      // Create order with the address ID (either existing or newly created)
      if (addressId) {
        const orderData = {
          status: 'pending',
          subtotal: getTotalPrice().toString(),
          taxes: '0.00',
          shipping: '50.00', // Fixed shipping fee
          discount: '0.00',
          notes: 'Order placed through web application',
          email: user?.email || '',
          phone: user?.phone_number || '', // Use phone_number from user
          shipping_address: addressId,
          items: items.map(item => ({
            product: item.id,
            quantity: item.quantity,
            price: item.price.toString(),
            custom_profit_percentage: 0, // Default to 0 if not specified
            custom_selling_price: item.price.toString() // Use the same price as default
          })),
        };

        console.log('Creating order with data:', orderData); // Debug log

        const response = await apiRequest('/orders/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(orderData),
        });

        if (response) {
          clearCart(); // Clear cart after successful order
          reset();
          replace(paths.eCommerce.orderCompleted);
        }
      } else {
        throw new Error('No shipping address available');
      }
    } catch (error) {
      console.error('Error in checkout:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <>
      <EcommerceHeader />

      <Container
        sx={{
          overflow: 'hidden',
          pt: 5,
          pb: { xs: 5, md: 10 },
        }}
      >
        <Typography variant="h3" sx={{ mb: 5 }}>
          Checkout
        </Typography>

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={{ xs: 5, md: 8 }}>
            <Grid xs={12} md={8}>
              <Stack spacing={5} divider={<Divider sx={{ borderStyle: 'dashed' }} />}>
                <div>
                  <StepLabel title="Shipping Details" step="1" />
                  <EcommerceCheckoutShippingDetails 
                    addresses={shippingAddresses}
                    selectedAddress={selectedAddress}
                    onSelectAddress={setSelectedAddress}
                  />
                </div>
              </Stack>
            </Grid>

            <Grid xs={12} md={4}>
              <EcommerceCheckoutOrderSummary
                tax={0}
                total={getTotalPrice() + 50} // Add shipping fee
                subtotal={getTotalPrice()}
                shipping={50} // Fixed shipping fee
                discount={0}
                products={items}
                loading={submitting}
              />
            </Grid>
          </Grid>
        </FormProvider>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

type StepLabelProps = {
  step: string;
  title: string;
};

function StepLabel({ step, title }: StepLabelProps) {
  return (
    <Stack direction="row" alignItems="center" sx={{ mb: 3, typography: 'h6' }}>
      <Box
        sx={{
          mr: 1.5,
          width: 28,
          height: 28,
          flexShrink: 0,
          display: 'flex',
          typography: 'h6',
          borderRadius: '50%',
          alignItems: 'center',
          bgcolor: 'primary.main',
          justifyContent: 'center',
          color: 'primary.contrastText',
        }}
      >
        {step}
      </Box>
      {title}
    </Stack>
  );
}
