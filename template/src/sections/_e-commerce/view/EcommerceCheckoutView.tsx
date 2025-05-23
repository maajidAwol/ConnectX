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
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form';
import LoadingScreen from 'src/components/loading-screen';
// store
import { useCartStore } from 'src/store/cart';
import { useAuthStore } from 'src/store/auth';
// api
import { apiRequest } from 'src/lib/api-config';
//
import {
  EcommerceCheckoutNewCardForm,
  EcommerceCheckoutOrderSummary,
  EcommerceCheckoutPaymentMethod,
  EcommerceCheckoutShippingMethod,
  EcommerceCheckoutPersonalDetails,
  EcommerceCheckoutShippingDetails,
} from '../checkout';
// types
import { CartItem } from 'src/store/cart';

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
  phone_number: string;
}

interface OrderResponse {
  id: string;
  order_number: string;
  status: string;
}

interface PaymentResponse {
  id: string;
  order: string;
  order_number: string;
  amount: string;
  payment_method: string;
  status: string;
  transaction_id: string;
}

interface ChapaPaymentResponse {
  status: string;
  message: string;
  data: {
    payment_id: string;
    checkout_url: string;
    tx_ref: string;
  };
}

interface User {
  id: string;
  email: string;
  phone_number: string;
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

type Props = {
  products: CartItem[];
  onDelete?: (id: string) => void;
  onDecreaseQuantity?: (id: string) => void;
  onIncreaseQuantity?: (id: string) => void;
};

export default function EcommerceCheckoutView({ products, onDelete, onDecreaseQuantity, onIncreaseQuantity }: Props) {
  const { replace } = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user, accessToken } = useAuthStore();
  const [shippingAddresses, setShippingAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'chapa' | 'cod'>('chapa');

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

  const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(event.target.value as 'chapa' | 'cod');
  };

  const formatPhoneNumber = (phone: string): string => {
    // Remove any non-digit characters except +
    let cleaned = phone.replace(/[^\d+]/g, '');
    
    // If it doesn't start with +, add it
    if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    
    // Remove any extra + symbols
    cleaned = cleaned.replace(/\+/g, '');
    cleaned = '+' + cleaned;
    
    // Ensure the number after + is between 9 and 14 digits
    const digitsAfterPlus = cleaned.substring(1);
    if (digitsAfterPlus.length < 9) {
      // Pad with zeros if too short
      cleaned = '+' + digitsAfterPlus.padEnd(9, '0');
    } else if (digitsAfterPlus.length > 14) {
      // Truncate if too long
      cleaned = '+' + digitsAfterPlus.substring(0, 14);
    }
    
    console.log('Formatted phone number:', cleaned);
    return cleaned;
  };

  const createOrder = async (addressId: string) => {
    const orderData = {
      status: 'pending',
      subtotal: getTotalPrice().toString(),
      taxes: '0.00',
      shipping: '50.00',
      discount: '0.00',
      notes: 'Order placed through web application',
      email: user?.email || '',
      phone: user?.phone_number || '',
      shipping_address: addressId,
      items: items.map(item => ({
        product: item.id,
        quantity: item.quantity,
        price: item.price.toString(),
        custom_profit_percentage: 0,
        custom_selling_price: item.price.toString()
      })),
    };

    console.log('Creating order with data:', orderData);

    const orderResponse = await apiRequest<OrderResponse>('/orders/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || '',
      },
      body: JSON.stringify(orderData),
    });

    return orderResponse;
  };

  const createPayment = async (orderId: string, amount: string) => {
    const paymentData = {
      order: orderId,
      amount: amount,
      payment_method: 'chapa',
      status: 'pending',
      transaction_id: ''
    };

    console.log('Creating payment with data:', paymentData);

    try {
      const paymentResponse = await apiRequest<PaymentResponse>('/payments/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || '',
        },
        body: JSON.stringify(paymentData),
      });

      return paymentResponse;
    } catch (error) {
      console.error('Payment creation error:', error);
      if (error instanceof Error) {
        try {
          const errorData = JSON.parse(error.message);
          console.error('Payment creation error details:', errorData);
          if (errorData.details) {
            console.error('Validation errors:', errorData.details);
          }
        } catch (e) {
          console.error('Raw error message:', error.message);
        }
      }
      throw error;
    }
  };

  const confirmCodPayment = async (paymentId: string) => {
    try {
      await apiRequest(`/payments/${paymentId}/confirm_cod_payment/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          confirmation_note: 'Order confirmed for Cash on Delivery',
        }),
      });
    } catch (error) {
      console.error('Error confirming COD payment:', error);
      throw error;
    }
  };

  const onSubmit = async (data: typeof defaultValues) => {
    try {
      setSubmitting(true);
      let addressId = selectedAddress?.id;
      
      // If no address is selected, create a new one
      if (!addressId) {
        console.log('No address selected, creating new address');
        const newAddress = await createShippingAddress(data);
        if (newAddress) {
          addressId = newAddress.id;
        } else {
          throw new Error('Failed to create shipping address');
        }
      } else {
        console.log('Using existing address:', selectedAddress);
      }

      if (!addressId) {
        throw new Error('No shipping address available');
      }

      const totalAmount = (getTotalPrice() + 50).toString();

      // Create order first
      console.log('Creating order with address ID:', addressId);
        const orderData = {
          status: 'pending',
          subtotal: getTotalPrice().toString(),
          taxes: '0.00',
        shipping: '50.00',
          discount: '0.00',
          notes: 'Order placed through web application',
          email: user?.email || '',
        phone: selectedAddress?.phone_number || (user as User)?.phone_number || '',
          shipping_address: addressId,
        items: items.map(item => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price.toString(),
          custom_profit_percentage: 0,
          custom_selling_price: item.price.toString()
        })),
      };

      console.log('Creating order with data:', orderData);

      const orderResponse = await apiRequest<OrderResponse>('/orders/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || '',
        },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse) {
        throw new Error('Failed to create order');
      }

      if (paymentMethod === 'chapa') {
        // Initialize Chapa payment
        const phoneNumber = selectedAddress?.phone_number || (user as User)?.phone_number || '';
        const formattedPhone = formatPhoneNumber(phoneNumber);

        console.log('Initializing Chapa payment with:', {
          orderId: orderResponse.id,
          phoneNumber: formattedPhone,
          returnUrl: `${window.location.origin}/payment/success`
        });

        const chapaResponse = await apiRequest<ChapaPaymentResponse>('/payments/initialize_chapa_payment/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || '',
          },
          body: JSON.stringify({
            order_id: orderResponse.id,
            phone_number: formattedPhone,
            return_url: `${window.location.origin}/payment/success`
          }),
        });

        console.log('Chapa payment response:', chapaResponse);

        if (!chapaResponse || chapaResponse.status !== 'success' || !chapaResponse.data?.checkout_url) {
          throw new Error('Failed to initialize Chapa payment');
        }

        // Store order data and transaction reference in session storage
        const pendingOrder = {
          orderId: orderResponse.id,
          addressId: addressId,
          items: items.map(item => ({
            product: item.id,
            quantity: item.quantity,
            price: item.price.toString(),
            custom_profit_percentage: 0,
            custom_selling_price: item.price.toString()
          })),
          totalAmount: totalAmount,
          paymentMethod: 'chapa',
          tx_ref: chapaResponse.data.tx_ref // Store the transaction reference
        };
        sessionStorage.setItem('pendingOrder', JSON.stringify(pendingOrder));

        // Redirect to Chapa checkout
        window.location.href = chapaResponse.data.checkout_url;
      } else if (paymentMethod === 'cod') {
        // For COD, create payment record and confirm
        const paymentResponse = await createPayment(orderResponse.id, totalAmount);
        if (paymentResponse) {
          await confirmCodPayment(paymentResponse.id);
          clearCart();
          reset();
          replace(paths.eCommerce.orderCompleted);
        }
      }
    } catch (error) {
      console.error('Error in checkout:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddressSelect = (address: ShippingAddress) => {
    console.log('Selected address:', address);
    setSelectedAddress(address);
  };

  const handlePlaceOrder = async () => {
    try {
      if (!selectedAddress) {
        return;
      }

      setSubmitting(true);

      const totalAmount = (getTotalPrice() + 50).toString();

      // Create order with selected address
      const orderData = {
        status: 'pending',
        subtotal: getTotalPrice().toString(),
        taxes: '0.00',
        shipping: '50.00',
        discount: '0.00',
        notes: 'Order placed through web application',
        email: user?.email || '',
        phone: selectedAddress.phone_number,
        shipping_address: selectedAddress.id,
        items: items.map(item => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price.toString(),
          custom_profit_percentage: 0,
          custom_selling_price: item.price.toString()
        })),
      };

      const orderResponse = await apiRequest<OrderResponse>('/orders/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || '',
        },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse) {
        throw new Error('Failed to create order');
      }

      if (paymentMethod === 'chapa') {
        // Initialize Chapa payment
        const formattedPhone = formatPhoneNumber(selectedAddress.phone_number);

        const chapaResponse = await apiRequest<ChapaPaymentResponse>('/payments/initialize_chapa_payment/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || '',
          },
          body: JSON.stringify({
            order_id: orderResponse.id,
            phone_number: formattedPhone,
            return_url: `${window.location.origin}/payment/success`
          }),
        });

        if (!chapaResponse || chapaResponse.status !== 'success' || !chapaResponse.data?.checkout_url) {
          throw new Error('Failed to initialize Chapa payment');
        }

        // Store order data and transaction reference in session storage
        const pendingOrder = {
          orderId: orderResponse.id,
          addressId: selectedAddress.id,
          items: items.map(item => ({
            product: item.id,
            quantity: item.quantity,
            price: item.price.toString(),
            custom_profit_percentage: 0,
            custom_selling_price: item.price.toString()
          })),
          totalAmount: totalAmount,
          paymentMethod: 'chapa',
          tx_ref: chapaResponse.data.tx_ref
        };
        sessionStorage.setItem('pendingOrder', JSON.stringify(pendingOrder));

        // Redirect to Chapa checkout
        window.location.href = chapaResponse.data.checkout_url;
      } else if (paymentMethod === 'cod') {
        // For COD, create payment record and confirm
        const paymentResponse = await createPayment(orderResponse.id, totalAmount);
        if (paymentResponse) {
          await confirmCodPayment(paymentResponse.id);
          clearCart();
          reset();
          replace(paths.eCommerce.orderCompleted);
        }
      }
    } catch (error) {
      // Silent error handling
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
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
                    onSelectAddress={handleAddressSelect}
                  />
                </div>

                <div>
                  <StepLabel title="Payment Method" step="2" />
                  <RadioGroup
                    value={paymentMethod}
                    onChange={handlePaymentMethodChange}
                    sx={{ mt: 2 }}
                  >
                    <FormControlLabel
                      value="chapa"
                      control={<Radio />}
                      label="Pay with Chapa"
                    />
                    <FormControlLabel
                      value="cod"
                      control={<Radio />}
                      label="Cash on Delivery"
                    />
                  </RadioGroup>
                </div>
              </Stack>
            </Grid>

            <Grid xs={12} md={4}>
              <EcommerceCheckoutOrderSummary
                tax={0}
                total={getTotalPrice() + 50}
                subtotal={getTotalPrice()}
                shipping={50}
                discount={0}
                products={items}
                loading={submitting}
                onPlaceOrder={handlePlaceOrder}
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
