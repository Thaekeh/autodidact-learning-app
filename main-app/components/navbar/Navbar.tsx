import React from "react";
import { Navbar, Button } from "@nextui-org/react";
import NextLink from "next/link";
import { NavbarAvatar } from "./NavbarAvatar";
import { useUser } from "@supabase/auth-helpers-react";
import { getRouteForAllFlashcardLists, getRouteForAllTexts } from "utils";

export const ComposedNavbar = () => {
  const user = useUser();

  return (
    <Navbar variant={"sticky"}>
      <Navbar.Brand>
        <NextLink href={user ? "/app" : "/"}>
          <h1>Learning Hub</h1>
        </NextLink>
      </Navbar.Brand>
      <Navbar.Content>
        <Navbar.Content>
          {user ? (
            <>
              <Navbar.Link as={"span"}>
                <NextLink href="/app">Dashboard</NextLink>
              </Navbar.Link>
              <Navbar.Link as={"span"}>
                <NextLink href={getRouteForAllFlashcardLists()}>
                  Flashcards
                </NextLink>
              </Navbar.Link>
              <Navbar.Link as={"span"}>
                <NextLink href={getRouteForAllTexts()}>Texts</NextLink>
              </Navbar.Link>
            </>
          ) : (
            <NextLink href={"/login"}>
              <Button size={"sm"}>Login</Button>
            </NextLink>
          )}
        </Navbar.Content>
        <Navbar.Content
          css={{
            "@xs": {
              w: "12%",
              jc: "flex-end",
            },
          }}
        >
          {user && <NavbarAvatar />}
        </Navbar.Content>
      </Navbar.Content>
    </Navbar>
  );
};
