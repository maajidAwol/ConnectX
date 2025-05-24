import { CacheProvider, EmotionCache } from '@emotion/react';
import Head from 'next/head';
import { NextPage } from 'next';
import { AppProps } from 'next/app';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ThemeProvider from 'src/theme';
import createEmotionCache from 'src/utils/createEmotionCache';
import ProgressBar from 'src/components/progress-bar';
import { ThemeSettings, SettingsProvider } from 'src/components/settings';
import MotionLazyContainer from 'src/components/animate/MotionLazyContainer';

// ----------------------------------------------------------------------

const clientSideEmotionCache = createEmotionCache();

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  Component: NextPageWithLayout;
}

export default function ClientOnlyApp(props: MyAppProps) {
  const { Component, pageProps, emotionCache = clientSideEmotionCache } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SettingsProvider>
          <ThemeProvider>
            <ThemeSettings>
              <MotionLazyContainer>
                <ProgressBar />
                {getLayout(<Component {...pageProps} />)}
              </MotionLazyContainer>
            </ThemeSettings>
          </ThemeProvider>
        </SettingsProvider>
      </LocalizationProvider>
    </CacheProvider>
  );
} 