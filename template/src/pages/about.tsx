// next
import Head from 'next/head';
// layouts
import MainLayout from 'src/layouts/main';
// sections

// ----------------------------------------------------------------------

ElearningAboutPage.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>;

// ----------------------------------------------------------------------

export default function ElearningAboutPage() {
  return (
    <>
      <Head>
        <title>About Us | ConnectX </title>
      </Head>
      <h1>About us to be added!</h1>
    </>
  );
}
