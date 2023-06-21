"use client";

import {
  createPagesBrowserClient,
  Session,
} from "@supabase/auth-helpers-nextjs";
import { TypedSupabaseClient } from "app/layout";
import { createContext, useContext, useState } from "react";

type MaybeSession = Session | null;

type SupabaseContext = {
  supabase: TypedSupabaseClient;
  session: MaybeSession;
};

// @ts-ignore
const Context = createContext<SupabaseContext>();

export default function SupabaseProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: MaybeSession;
}) {
  const [supabase] = useState(() => createPagesBrowserClient());

  return (
    <Context.Provider value={{ supabase, session }}>
      <>{children}</>
    </Context.Provider>
  );
}

export const useSupabase = () => useContext(Context);
