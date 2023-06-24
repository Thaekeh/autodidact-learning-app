"use client";
import React, { createContext, useState } from "react";

interface ConfirmContextData {
  prompt: string;
  isOpen: boolean;
  proceed: ((value: unknown) => void) | null;
  cancel: ((value: unknown) => void) | null;
}

export const ConfirmContext = createContext<
  [ConfirmContextData, React.Dispatch<React.SetStateAction<ConfirmContextData>>]
>([
  {
    prompt: "",
    isOpen: false,
    proceed: null,
    cancel: null,
  },
  () => null,
]);

const ConfirmContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [confirm, setConfirm] = useState<ConfirmContextData>({
    prompt: "",
    isOpen: false,
    proceed: null,
    cancel: null,
  });

  return (
    <ConfirmContext.Provider value={[confirm, setConfirm]}>
      {children}
    </ConfirmContext.Provider>
  );
};

export default ConfirmContextProvider;
