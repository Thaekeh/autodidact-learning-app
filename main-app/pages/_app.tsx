import type { AppProps } from "next/app";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import { Layout } from "../components/Layout";
import { NextUIProvider } from "@nextui-org/react";
import { SSRProvider } from "@react-aria/ssr";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  session: Session;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  return (
    <SSRProvider>
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <NextUIProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </NextUIProvider>
      </SessionProvider>
    </SSRProvider>
  );
}
