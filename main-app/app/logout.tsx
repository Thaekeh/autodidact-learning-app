import React from "react";
import { Button } from "@nextui-org/react";
import { useUser } from "@supabase/auth-helpers-react";
import { useSupabase } from "components/providers/supabase-provider";

export default function Logout() {
  // const { supabase } = useSupabase();

  const onLogout = () => {
    //   supabase.auth.signOut();
  };

  // const user = useUser();

  return (
    <div>
      {/* {user ? "logged in" : "logged out"} */}
      <Button onPress={onLogout}>Logout</Button>
    </div>
  );
}
