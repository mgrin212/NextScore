import '@/styles/globals.css'
import type { AppProps } from 'next/app'


import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="font-roboto">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;

