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
import { getRouteForAllFlashcardLists, getRouteForAllTexts } from "utils";
import { useSupabase } from "components/providers/supabase-provider";
import { LearningHubLogo } from "components/logo/LearningHubLogo";
import { useRouter } from "next/navigation";

const NAVBAR_HEIGHT = "4rem";

export const ComposedNavbar = () => {
  const { supabase, session } = useSupabase();

  // const isActiveRoute = (href: string) => {
  //   console.log(
  //     window.location.pathname,
  //     href,
  //     window.location.pathname === href
  //   );
  //   return window.location.href === href;
  // };

  return (
    <Navbar height={NAVBAR_HEIGHT} position="fixed">
      <NavbarBrand className="h-12">
        <div className="w-12 h-12 mr-2">
          <LearningHubLogo />
        </div>
        <NextLink href={supabase ? "/app" : "/"}>
          <h1>Learning Hub</h1>
        </NextLink>
      </NavbarBrand>
      <NavbarContent>
        <NavbarContent>
          {supabase ? (
            <>
              <NavbarItem
                as={NextLink}
                href="/app"
                // isActive={isActiveRoute("/app")}
              >
                Dashboard
              </NavbarItem>
              <NavbarItem
                as={NextLink}
                href={getRouteForAllFlashcardLists()}
                // isActive={isActiveRoute(getRouteForAllFlashcardLists())}
              >
                Flashcards
              </NavbarItem>
              <NavbarItem
                as={NextLink}
                href={getRouteForAllTexts()}
                // isActive={isActiveRoute(getRouteForAllTexts())}
              >
                Texts
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
