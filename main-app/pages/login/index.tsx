import { useSession } from "next-auth/react";
import React from "react";
import { LoginForm } from "../../components/authentication/LoginForm";

export default function Login() {
  const { data } = useSession();
  return (
    <div>
      {data?.user ? "logged in" : "not logged in"}
      <LoginForm />
    </div>
  );
}
