// next
import Head from 'next/head';
// sections
import { LoginCoverView } from 'src/sections/auth/view';

// ----------------------------------------------------------------------

export default function LoginCoverPage() {
  return (
    <>
      <Head>
        <title>Login Cover | ConnectX</title>
      </Head>

      <LoginCoverView />
    </>
  );
}
