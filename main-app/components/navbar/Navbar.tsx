"use client";

import React from "react";
import {
  Navbar,
  Button,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import NextLink from "next/link";
import { NavbarAvatar } from "./NavbarAvatar";
import { useUser } from "@supabase/auth-helpers-react";
import { getRouteForAllFlashcardLists, getRouteForAllTexts } from "utils";

export const ComposedNavbar = () => {
  const user = useUser();

  return (
    <Navbar>
      <NavbarBrand>
        <NextLink href={user ? "/app" : "/"}>
          <h1>Learning Hub</h1>
        </NextLink>
      </NavbarBrand>
      <NavbarContent>
        <NavbarContent>
          {user ? (
            <>
              <NavbarItem as={"span"}>
                <NextLink href="/app">Dashboard</NextLink>
              </NavbarItem>
              <NavbarItem as={"span"}>
                <NextLink href={getRouteForAllFlashcardLists()}>
                  Flashcards
                </NextLink>
              </NavbarItem>
              <NavbarItem as={"span"}>
                <NextLink href={getRouteForAllTexts()}>Texts</NextLink>
              </NavbarItem>
            </>
          ) : (
            <NextLink href={"/login"}>
              <Button size={"sm"}>Login</Button>
            </NextLink>
          )}
        </NavbarContent>
        <NavbarContent
        // style={{
        //   "@xs": {
        //     w: "12%",
        //     jc: "flex-end",
        //   },
        // }}
        >
          {user && <NavbarAvatar />}
        </NavbarContent>
      </NavbarContent>
    </Navbar>
  );
};
