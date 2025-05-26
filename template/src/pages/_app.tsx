// scroll bar
import 'simplebar-react/dist/simplebar.min.css';

// lightbox
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

// slick-carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';

// ----------------------------------------------------------------------

import dynamic from 'next/dynamic';
import { AppProps } from 'next/app';

const ClientOnlyApp = dynamic(() => import('src/components/ClientOnlyApp'), {
  ssr: false,
});

export default function App(props: AppProps) {
  return <ClientOnlyApp {...props} />;
}
