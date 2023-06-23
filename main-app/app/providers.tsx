"use client";
import { SSRProvider } from "@react-aria/ssr";
import React from "react";

import { NextUIProvider } from "@nextui-org/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SSRProvider>
      <NextUIProvider>{children}</NextUIProvider>
    </SSRProvider>
  );
}
