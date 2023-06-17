import { ComposedNavbar } from "components/navbar/Navbar";
import React from "react";

export default function NavbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ComposedNavbar />
      <main>{children}</main>
    </>
  );
}
