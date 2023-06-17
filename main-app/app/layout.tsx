import { Providers } from "./providers";
import "./globals.css";
import {
  createServerComponentClient,
  SupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "types";
import SupabaseProvider from "components/providers/supabase-provider";

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
        <SupabaseProvider session={session}>
          <Providers>{children}</Providers>
        </SupabaseProvider>
      </body>
    </html>
  );
}
