import React from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@nextui-org/react";

export default function Logout() {
  const { data } = useSession();
  const onLogout = () => {
    signOut({ redirect: false });
  };
  return (
    <div>
      {data?.user ? "logged in" : "logged out"}
      <Button onClick={onLogout}>Logout</Button>
    </div>
  );
}
