import "@/styles/globals.css";
import "@/styles/skeleton-chart-custom.css";
import "react-loading-skeleton/dist/skeleton.css";

import { Layout } from "@/components/layout";
import { SolanaProvider } from "@/components/provider/solana";
import { ConnectionProvider } from "@/context/ConnectionContext";
import { UserProvider } from "@/context/UserContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import NextProgress from "next-progress";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false, // Do not refetch on mount
      refetchOnWindowFocus: false, // Do not refetch when window regains focus
    },
  },
});

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
          <QueryClientProvider client={queryClient}>
            <ConnectionProvider>
              <ThemeProvider attribute="class" defaultTheme="light">
                <Layout>
                  <Component {...pageProps} />
                  <SpeedInsights />
                  <Analytics />
                </Layout>
              </ThemeProvider>
            </ConnectionProvider>
            {process.env.VERCEL_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
          </QueryClientProvider>
          <Toaster position="bottom-right" />
        </UserProvider>
      </SolanaProvider>
    </>
  );
}
