import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ReactElement, ReactNode, useState } from "react";
import { NextPage } from "next";
import { Layout } from "../components/Layout";
import { NextUIProvider } from "@nextui-org/react";
import { SSRProvider } from "@react-aria/ssr";
import Head from "next/head";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  initialSession: Session;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <SSRProvider>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <NextUIProvider>
          <Layout>
            <Head>
              <title>Learning Hub</title>
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <Component {...pageProps} />
          </Layout>
        </NextUIProvider>
      </SessionContextProvider>
    </SSRProvider>
  );
}
