"use client";

import React, { useEffect } from "react";
import {
  Navbar,
  Button,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import NextLink from "next/link";
import { NavbarAvatar } from "./NavbarAvatar";
import { getRouteForAllFlashcardLists, getRouteForAllTexts } from "utils";
import { useSupabase } from "components/providers/supabase-provider";

const NAVBAR_HEIGHT = "4rem";

export const ComposedNavbar = () => {
  const { supabase, session } = useSupabase();

  return (
    <Navbar height={NAVBAR_HEIGHT} position="sticky">
      <NavbarBrand>
        <NextLink href={supabase ? "/app" : "/"}>
          <h1>Learning Hub</h1>
        </NextLink>
      </NavbarBrand>
      <NavbarContent>
        <NavbarContent>
          {supabase ? (
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
        <NavbarContent>{supabase && <NavbarAvatar />}</NavbarContent>
      </NavbarContent>
    </Navbar>
  );
};
