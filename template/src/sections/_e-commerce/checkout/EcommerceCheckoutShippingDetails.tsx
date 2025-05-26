import { useState } from 'react';
// @mui
import {
  Stack,
  Radio,
  Button,
  Collapse,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
// form
import { useFormContext } from 'react-hook-form';
// assets
import { countries } from 'src/assets/data';
// components
import { RHFTextField, RHFSelect } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  addresses: any[];
  selectedAddress: any;
  onSelectAddress: (address: any) => void;
};

export default function EcommerceCheckoutShippingDetails({
  addresses,
  selectedAddress,
  onSelectAddress,
}: Props) {
  const [showNewAddress, setShowNewAddress] = useState(false);
  const { register } = useFormContext();

  const handleSelectAddress = (address: any) => {
    onSelectAddress(address);
    setShowNewAddress(false);
  };

  const handleShowNewAddress = () => {
    setShowNewAddress(true);
    onSelectAddress(null);
  };

  return (
    <Stack spacing={3}>
      {addresses.map((address) => (
        <FormControlLabel
          key={address.id}
          control={
            <Radio
              checked={selectedAddress?.id === address.id}
              onChange={() => handleSelectAddress(address)}
            />
          }
          label={
            <Stack spacing={0.5}>
              <Typography variant="subtitle2">{address.label}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {address.full_address}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {address.phone_number}
              </Typography>
            </Stack>
          }
          sx={{
            m: 0,
            width: 1,
            p: 2,
            borderRadius: 1,
            border: (theme) => `solid 1px ${theme.palette.divider}`,
            ...(selectedAddress?.id === address.id && {
            borderColor: 'primary.main',
            }),
          }}
        />
      ))}

      <FormControlLabel
        control={<Radio checked={showNewAddress} onChange={handleShowNewAddress} />}
        label="Add new address"
        sx={{
          m: 0,
          width: 1,
          p: 2,
          borderRadius: 1,
          border: (theme) => `solid 1px ${theme.palette.divider}`,
          ...(showNewAddress && {
            borderColor: 'primary.main',
          }),
        }}
      />

      <Collapse in={showNewAddress}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Label"
            placeholder="Home, Office, etc."
            {...register('label')}
          />

          <TextField
            fullWidth
            label="Street Address"
            {...register('streetAddress')}
          />

          <TextField
            fullWidth
            label="City"
            {...register('city')}
          />

          <TextField
            fullWidth
            label="Zip Code"
            {...register('zipCode')}
          />

          <TextField
            fullWidth
            label="Country"
            {...register('country')}
          />

          <TextField
            fullWidth
            label="Phone Number"
            {...register('phoneNumber')}
          />
        </Stack>
      </Collapse>
    </Stack>
  );
}
