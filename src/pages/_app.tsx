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
        <title>MemechanSOL</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, minimum-scale=1, viewport-fit=cover"
        />
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
