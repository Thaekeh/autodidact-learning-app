"use client";
import { useUser } from "@supabase/auth-helpers-react";
import React from "react";
import { LoginForm } from "components/authentication/LoginForm";
import AuthForm from "app/auth-form";

export default function Login() {
  return (
    <div>
      <LoginForm />

      {/* <AuthForm /> */}
    </div>
  );
}
