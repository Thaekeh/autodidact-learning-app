import React, { ChangeEvent, FormEvent, useState } from "react";
import { Button, FormElement, Input } from "@nextui-org/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

export const LoginForm = () => {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    if (!event) return;
    event.preventDefault();
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: formValues.email,
        password: formValues.password,
      });
    if (signInData) {
      router.push("/app");
    }
    if (signInError) {
      await supabase.auth.signUp({
        email: formValues.email,
        password: formValues.password,
      });
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
    <form onSubmit={onSubmit}>
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
      <Button type="submit">Login</Button>
    </form>
  );
};
