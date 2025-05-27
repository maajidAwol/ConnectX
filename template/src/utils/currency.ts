type InputValue = string | number | null;

export function fCurrency(number: InputValue) {
  if (!number) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(number));
} 