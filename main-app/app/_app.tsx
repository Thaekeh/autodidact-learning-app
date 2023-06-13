import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode, useState } from "react";
import { NextPage } from "next";
import { Layout } from "components/Layout";
import { NextUIProvider } from "@nextui-org/react";
import { SSRProvider } from "@react-aria/ssr";
import ConfirmContextProvider from "providers/ConfirmContextProvider";
import { ConfirmModal } from "components/modals/ConfirmModal";
import { appWithTranslation } from "next-i18next";
import { NavbarLayout } from "./NavbarLayout";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  initialSession: Session;
};

function App({ Component, pageProps }: AppPropsWithLayout) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <SSRProvider>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <NextUIProvider>
          <ConfirmContextProvider>
            <ConfirmModal />
            <NavbarLayout>
              {/* <Head>
                <title>Learning Hub</title>
                <link rel="icon" href="/favicon.ico" />
              </Head> */}
              <Component {...pageProps} />
            </NavbarLayout>
          </ConfirmContextProvider>
        </NextUIProvider>
      </SessionContextProvider>
    </SSRProvider>
  );
}

// export default App;

export default appWithTranslation(App);
