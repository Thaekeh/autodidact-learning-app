import React from "react";
import { Navbar, Button, theme } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import NextLink from "next/link";
import { NavbarAvatar } from "./NavbarAvatar";

export const ComposedNavbar = () => {
  const { data } = useSession();

  return (
    <Navbar variant={"sticky"}>
      <Navbar.Brand>
        <NextLink href={"/"}>
          <h1>Learning Hub</h1>
        </NextLink>
      </Navbar.Brand>
      <Navbar.Content>
        {data?.user ? (
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
