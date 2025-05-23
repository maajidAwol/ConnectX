// next
import Head from 'next/head';
// layouts
import MainLayout from 'src/layouts/main';
// sections
import { EcommerceWishlistView } from 'src/sections/_e-commerce/view';
import { _products } from 'src/_mock';

// ----------------------------------------------------------------------

EcommerceWishlistPage.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>;

// ----------------------------------------------------------------------

export default function EcommerceWishlistPage() {
  return (
    <>
      <Head>
        <title>Wishlist | ConnectX</title>
      </Head>
    
      <EcommerceWishlistView products={_products} />
    </>
  );
}
