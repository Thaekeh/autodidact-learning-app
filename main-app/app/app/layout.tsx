import { ConfirmModal } from "components/modals/ConfirmModal";
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
      <main className="mt-16 p-4">{children}</main>
    </>
  );
}
