import React from "react";
import { Navbar, Button } from "@nextui-org/react";
import NextLink from "next/link";
import { NavbarAvatar } from "./NavbarAvatar";
import { useUser } from "@supabase/auth-helpers-react";

export const ComposedNavbar = () => {
  const user = useUser();

  return (
    <Navbar variant={"sticky"}>
      <Navbar.Brand>
        <NextLink href={"/"}>
          <h1>Learning Hub</h1>
        </NextLink>
      </Navbar.Brand>
      <Navbar.Content>
        {user ? (
          <>
            <Navbar.Link as={"span"}>
              <NextLink href="/app">Dashboard</NextLink>
            </Navbar.Link>
            <Navbar.Link as={"span"}>
              <NextLink href="/flashcards">Flashcards</NextLink>
            </Navbar.Link>
            <Navbar.Link as={"span"}>
              <NextLink href="/texts">Texts</NextLink>
            </Navbar.Link>
            <Navbar.Link as={"span"}>
              <NavbarAvatar />
            </Navbar.Link>
          </>
        ) : (
          <NextLink href={"/login"}>
            <Button size={"sm"}>Login</Button>
          </NextLink>
        )}
      </Navbar.Content>
    </Navbar>
  );
};
