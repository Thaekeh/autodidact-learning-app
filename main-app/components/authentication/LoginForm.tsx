import React from "react";
import { signIn } from "next-auth/react";

export const LoginForm = () => {
  const onFinish = async (values: any) => {
    const result = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });
  };

  return (
    // TODO(Thaeke) fix it
    // <Form onFinish={onFinish} wrapperCol={{ span: 6 }} layout="horizontal">
    //   <Form.Item required={true} label={"Email"} name={"email"}>
    //     <Input type="email"></Input>
    //   </Form.Item>
    //   <Form.Item required={true} label={"Password"} name={"password"}>
    //     <Input type="password"></Input>
    //   </Form.Item>
    //   <Form.Item>
    //     <Button type="primary" htmlType="submit">
    //       Login
    //     </Button>
    //   </Form.Item>
    // </Form>
  );
};
