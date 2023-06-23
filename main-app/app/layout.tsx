import "./globals.css";
import {
  createServerComponentClient,
  SupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "types";
import SupabaseProvider from "components/providers/supabase-provider";
import ConfirmContextProvider from "providers/ConfirmContextProvider";
import { ConfirmModal } from "components/modals/ConfirmModal";
import { ComposedNavbar } from "components/navbar/Navbar";
import { Providers } from "./providers";

export type TypedSupabaseClient = SupabaseClient<Database>;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <head />
      <body>
        <Providers>
          <SupabaseProvider session={session}>
            <ConfirmContextProvider>
              <ConfirmModal />
              <main className="mt-16 p-4 mx-auto max-w-screen-lg">
                <ComposedNavbar />
                {children}
              </main>
            </ConfirmContextProvider>
          </SupabaseProvider>
        </Providers>
      </body>
    </html>
  );
}
