import { Form, Input } from "antd";
import React from "react";

export const LoginForm = () => {
  return (
    <Form>
      <Form.Item required={true} label="Email">
        <Input type="email"></Input>
      </Form.Item>
    </Form>
  );
};
