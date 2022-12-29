import React from "react";
import { ComposedNavbar } from "./Navbar";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ComposedNavbar />
      <main>{children}</main>
    </>
  );
};
