import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { useSupabase } from "components/providers/supabase-provider";

export default function Logout() {
  const { supabase } = useSupabase();

  const onLogout = () => {
    supabase.auth.signOut();
  };

  const user = useUser();

  return (
    <div>
      {user ? "logged in" : "logged out"}
      <Button onClick={onLogout}>Logout</Button>
    </div>
  );
}
