import React from "react";
import { Button } from "@nextui-org/react";
import { useSupabase } from "components/supabase-provider";

export default function Logout() {
  const { supabase } = useSupabase();

  const onLogout = () => {
    supabase.auth.signOut();
  };

  return (
    <div>
      <Button onPress={onLogout}>Logout</Button>
    </div>
  );
}
