import { Button } from "antd";
import React from "react";
import { signOut, useSession } from "next-auth/react";

export default function Logout() {
  const { data } = useSession();
  const onLogout = () => {
    event?.preventDefault();
    signOut({ redirect: false });
  };
  return (
    <div>
      {data?.user ? "logged in" : "logged out"}
      <Button onClick={onLogout}>Logout</Button>
    </div>
  );
}
