import { ComposedNavbar } from "components/navbar/Navbar";
import React from "react";

export const NavbarLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ComposedNavbar />
      <main>{children}</main>
    </>
  );
};
