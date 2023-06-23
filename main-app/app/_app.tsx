import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode, useState } from "react";
import { NextPage } from "next";
import { appWithTranslation } from "next-i18next";
import NavbarLayout from "./app/layout";
import { ConfirmModal } from "components/modals/ConfirmModal";
import ConfirmContextProvider, {
  ConfirmContext,
} from "providers/ConfirmContextProvider";
import { Database } from "types";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  initialSession: Session;
};

function App({ Component, pageProps }: AppPropsWithLayout) {
  const [supabaseClient] = useState(() => createPagesBrowserClient<Database>());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      {/* <NextUIProvider> */}
      <NavbarLayout>
        <Component {...pageProps} />
      </NavbarLayout>
      {/* </NextUIProvider> */}
    </SessionContextProvider>
  );
}

// export default App;

export default appWithTranslation(App);
