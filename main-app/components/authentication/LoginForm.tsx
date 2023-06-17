"use client";
import React, { FormEvent, useEffect, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import styled from "@emotion/styled";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const LoginForm = () => {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const [formSubmitIsLoading, setFormSubmitIsLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    if (!event) return;
    setFormSubmitIsLoading(true);
    event.preventDefault();

    // TODO: implement signup with auth/callback: https://supabase.com/docs/guides/auth/auth-helpers/nextjs#client-side
    try {
      supabase.auth
        .signInWithPassword({
          email: formValues.email,
          password: formValues.password,
        })
        .then(() => {
          router.push("/app");
          setFormSubmitIsLoading(false);
        });
    } catch (error) {
      console.log("error", error);
      setFormSubmitIsLoading(false);
    }
  };

  const handleInputChange = (value: string, field: string) => {
    setFormValues({
      ...formValues,
      [field]: value,
    });
  };

  return (
    <StyledDiv>
      <h3>Login</h3>
      <StyledForm onSubmit={onSubmit}>
        <Input
          label="Email"
          name="email"
          required={true}
          value={formValues.email || ""}
          onValueChange={(value) => handleInputChange(value, "email")}
        ></Input>
        <Input
          label="Password"
          name="password"
          type="password"
          value={formValues.password || ""}
          onValueChange={(value) => handleInputChange(value, "password")}
        ></Input>
        <Button
          variant="flat"
          color={"secondary"}
          isLoading={formSubmitIsLoading}
          type="submit"
        >
          Login
        </Button>
      </StyledForm>
    </StyledDiv>
  );
};

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 300px;
  margin: 0 auto;
  height: 90vh;
  justify-content: center;
`;
