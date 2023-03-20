import { useUser } from "@supabase/auth-helpers-react";
import React from "react";
import { LoginForm } from "components/authentication/LoginForm";

export default function Login() {
  const user = useUser();
  return (
    <div>
      {user && user.role}
      <LoginForm />
    </div>
  );
}
