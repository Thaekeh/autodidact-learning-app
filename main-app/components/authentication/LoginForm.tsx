"use client";
import React, { useState } from "react";
import { Button, Input, Spacer } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useSupabase } from "components/supabase-provider";

export const LoginForm = () => {
  const { supabase } = useSupabase();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const { session } = useSupabase();

  // const [formValues, setFormValues] = useState({ email: "", password: "" });
  // const [formSubmitIsLoading, setFormSubmitIsLoading] = useState(false);

  // const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   if (!event) {
  //     console.log("no event");
  //     return;
  //   }

  //   setFormSubmitIsLoading(true);

  //   try {
  //     console.log("formaValues", formValues);
  //     await supabase.auth.signInWithPassword({
  //       email: formValues.email,
  //       password: formValues.password,
  //     });
  //     router.push(getRouteForDashboard());
  //     // supabase.auth
  //     //   .signInWithPassword({
  //     //     email: formValues.email,
  //     //     password: formValues.password,
  //     //   })
  //     //   .then(() => {
  //     //     router.push(getRouteForDashboard());
  //     //     // setFormSubmitIsLoading(false);
  //     //   });
  //   } catch (error) {
  //     console.log("error", error);
  //     setFormSubmitIsLoading(false);
  //   }
  const handleSignIn = async () => {
    await supabase.auth.signInWithPassword({
      email,
      password,
    });
    router.refresh();
  };

  // const handleInputChange = (value: string, field: string) => {
  //   setFormValues({
  //     ...formValues,
  //     [field]: value,
  //   });
  // };

  return (
    <div className="w-80 m-auto align-middle gap-y-4 flex flex-col">
      <div className="flex justify-center">
        <h1 className="text-xl">Login</h1>
      </div>
      <Spacer y={8} />
      {/* {session && <p>Logged in as {session.user.email}</p>} */}
      {/* <form onSubmit={handleSignIn}> */}
      <Input
        label="Email"
        color="secondary"
        name="email"
        variant="bordered"
        labelPlacement="outside"
        required={true}
        value={email || ""}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email"
      />
      <Input
        label="Password"
        color="secondary"
        name="password"
        labelPlacement="outside"
        variant="bordered"
        type="password"
        value={password || ""}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Password"
      ></Input>
      <Button
        variant="flat"
        color={"secondary"}
        type="submit"
        onPress={handleSignIn}
      >
        Login
      </Button>
      {/* </form> */}
    </div>
  );
};
