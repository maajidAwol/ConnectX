// next
import Head from 'next/head';
// layouts
import MainLayout from 'src/layouts/main';
// sections
import { EcommerceCheckoutView } from 'src/sections/_e-commerce/view';
import { useCartStore } from 'src/store/cart';

// ----------------------------------------------------------------------

EcommerceCheckoutPage.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>;

// ----------------------------------------------------------------------

export default function EcommerceCheckoutPage() {
  const { items } = useCartStore();
  return (
    <>
      <Head>
        <title>Checkout | ConnectX</title>
      </Head>

      <EcommerceCheckoutView products={items} />
    </>
  );
}
