import { headers, cookies } from "next/headers";
// import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "types";

export const createServerClient = () =>
  createServerComponentClient<Database>({
    cookies,
  });
