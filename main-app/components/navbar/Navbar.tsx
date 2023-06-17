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
import { useSession, useUser } from "@supabase/auth-helpers-react";
import { create } from "domain";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSupabase } from "components/providers/supabase-provider";

export const ComposedNavbar = () => {
  const { supabase, session } = useSupabase();

  return (
    <Navbar>
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
