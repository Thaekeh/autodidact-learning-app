"use client";

import { NextUIProvider } from "@nextui-org/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // <SSRProvider>
    <NextUIProvider>{children}</NextUIProvider>
    // </SSRProvider>
  );
}
