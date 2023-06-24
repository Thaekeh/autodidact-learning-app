"use client";
import React from "react";
import { LoginForm } from "components/authentication/LoginForm";

export default function Login() {
  const [currentView, setCurrentView] = React.useState<"login" | "register">(
    "login"
  );

  return (
    <div>
      {currentView === "login" ? (
        <LoginForm />
      ) : (
        <div>
          <h3>Register</h3>
          <p>Register form</p>
        </div>
      )}

      {/* <AuthForm /> */}
    </div>
  );
}
