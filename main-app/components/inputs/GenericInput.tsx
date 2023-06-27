import { Input } from "@nextui-org/react";
import React, { useState } from "react";

export const GenericInput = ({
  initialValue,
  onInputFieldBlur,
  label,
}: {
  initialValue: string | null;
  onInputFieldBlur: (value: string) => void;
  label: string;
}) => {
  const [inputValue, setInputValue] = useState(initialValue || "");

  return (
    <Input
      variant="bordered"
      color="secondary"
      label={label}
      labelPlacement="outside"
      value={inputValue}
      onValueChange={setInputValue}
      onBlur={() => onInputFieldBlur(inputValue)}
    />
  );
};
