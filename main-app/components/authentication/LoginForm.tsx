import React, { ChangeEvent, FormEvent, useState } from "react";
import { Button, FormElement, Input, Loading, Text } from "@nextui-org/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";

export const LoginForm = () => {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const [formSubmitIsLoading, setFormSubmitIsLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    if (!event) return;
    setFormSubmitIsLoading(true);
    event.preventDefault();
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

  const handleInputChange = (event: ChangeEvent<FormElement>) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  return (
    <StyledDiv>
      <Text h3>Login</Text>
      <StyledForm onSubmit={onSubmit}>
        <Input
          label="Email"
          name="email"
          required={true}
          value={formValues.email || ""}
          onChange={handleInputChange}
        ></Input>
        <Input
          label="Password"
          name="password"
          type="password"
          value={formValues.password || ""}
          onChange={handleInputChange}
        ></Input>
        <Button flat color={"secondary"} type="submit">
          {formSubmitIsLoading ? (
            <Loading color={"currentColor"} type="points" />
          ) : (
            "Login"
          )}
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
