import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";

export default function Logout() {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  const onLogout = () => {
    supabaseClient.auth.signOut();
  };

  const user = useUser()

  return (
    <div>
      {user ? "logged in" : "logged out"}
      <Button onClick={onLogout}>Logout</Button>
    </div>
  );
}
