"use client";
import React, { FormEvent, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import styled from "@emotion/styled";
import { useSupabase } from "components/supabase-provider";

export const LoginForm = () => {
  const { supabase } = useSupabase();
  const router = useRouter();

  // const { session } = useSupabase();

  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const [formSubmitIsLoading, setFormSubmitIsLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    if (!event) return;
    setFormSubmitIsLoading(true);
    event.preventDefault();

    try {
      supabase.auth.signUp({
        email: formValues.email,
        password: formValues.password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
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
      <h3>Register</h3>
      {/* {session && <p>Logged in as {session.user.email}</p>} */}
      <StyledForm onSubmit={onSubmit}>
        <Input
          label="Email"
          name="email"
          variant="bordered"
          required={true}
          value={formValues.email || ""}
          onChange={(event) => handleInputChange(event.target.value, "email")}
          // onValueChange={(value) => handleInputChange(value, "email")}
        ></Input>
        <Input
          label="Password"
          name="password"
          type="password"
          variant="bordered"
          value={formValues.password || ""}
          onChange={(event) =>
            handleInputChange(event.target.value, "password")
          }

          // onValueChange={(value) => handleInputChange(value, "password")}
        ></Input>
        <Button
          variant="flat"
          color={"secondary"}
          // loading={formSubmitIsLoading}
          // isLoading={formSubmitIsLoading}
          type="submit"
        >
          Register
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
