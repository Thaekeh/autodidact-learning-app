import React from "react";
import { ComposedNavbar } from "./navbar/Navbar";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ComposedNavbar />
      <main>{children}</main>
    </>
  );
};
