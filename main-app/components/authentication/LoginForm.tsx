import React, { ChangeEvent, FormEvent, SyntheticEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { Button, FormElement, Input } from "@nextui-org/react";

export const LoginForm = () => {
  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    if (!event) return;
    event.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email: formValues.email,
      password: formValues.password,
    });
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
