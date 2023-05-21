import { Input, useInput } from "@nextui-org/react";
import React from "react";

export const GenericInput = ({
  initialValue,
  onInputFieldBlur,
  label,
}: {
  initialValue: string | null;
  onInputFieldBlur: (value: string) => void;
  label: string;
}) => {
  const { value, bindings } = useInput(initialValue || "");

  return (
    <Input
      shadow={false}
      label={label}
      value={value}
      onChange={bindings.onChange}
      onBlur={() => onInputFieldBlur(value)}
    />
  );
};
