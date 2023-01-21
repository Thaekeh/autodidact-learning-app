import React from "react";
import { Navbar, Avatar, Link, Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import NextLink from "next/link";
import { User } from "react-feather";

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
              <NextLink href="/profile">
                {data.user && (
                  <Avatar
                    text={data.user.name || ""}
                    icon={data.user.image ? undefined : <User />}
                  />
                )}
              </NextLink>
            </Navbar.Link>
          </>
        ) : (
          <NextLink href={"/login"}>
            <Button>Login</Button>
          </NextLink>
        )}
      </Navbar.Content>
    </Navbar>
  );
};
