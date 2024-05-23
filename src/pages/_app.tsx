import "@/styles/globals.css";

import { Layout } from "@/components/layout";
import { UserProvider } from "@/context/UserContext";
import NextProgress from "next-progress";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import { SolanaProvider } from "@/components/provider/solana";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Memechan</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, minimum-scale=1, viewport-fit=cover"
        />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        {/* Open graph */}
        <meta property="og:title" content="Memechan" />
        <meta
          property="og:description"
          content="Memes into instant tradeables with zero liquidity seeding required. 🤍"
        />
        <meta property="og:image" content="/og-image.jpeg" />
        <meta property="og:url" content="https://memechan.com" />
        <meta property="og:type" content="website" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Memechan" />
        <meta
          name="twitter:description"
          content="Memes into instant tradeables with zero liquidity seeding required. 🤍"
        />
        <meta name="twitter:image" content="/og-image.jpeg" />
        <meta name="twitter:site" content="@memechan" />
        <meta name="twitter:creator" content="@memechan" />
      </Head>
      <NextProgress options={{ showSpinner: false }} />
      <SolanaProvider>
        <UserProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <Toaster position="bottom-right" />
        </UserProvider>
      </SolanaProvider>
    </>
  );
}
