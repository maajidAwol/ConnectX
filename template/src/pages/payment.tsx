// next
import Head from 'next/head';
// layouts
import SimpleLayout from 'src/layouts/simple';
// sections
import { PaymentView } from 'src/sections/payment/view';

// ----------------------------------------------------------------------

PaymentPage.getLayout = (page: React.ReactElement) => <SimpleLayout>{page}</SimpleLayout>;

// ----------------------------------------------------------------------

export default function PaymentPage() {
  return (
    <>
      <Head>
        <title>Payment | ConnectX</title>
      </Head>

      <PaymentView />
    </>
  );
}
