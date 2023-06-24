"use client";
import React from "react";
import {
  Navbar,
  Button,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { LearningHubLogo } from "components/logo/LearningHubLogo";
import { useSupabase } from "components/supabase-provider";
import NextLink from "next/link";
import {
  getRouteForAllFlashcardLists,
  getRouteForAllTexts,
} from "@/utils/routing";
import { NavbarAvatar } from "./NavbarAvatar";
import { getRouteForDashboard } from "@/utils/routing/general";

const NAVBAR_HEIGHT = "4rem";

export function ComposedNavbar() {
  const { supabase, session } = useSupabase();
  // const user = use(supabase.auth.getUser());

  // const [user, setUser] = useState<User | null>(null);

  return (
    <Navbar height={NAVBAR_HEIGHT} position="fixed" className="bg-ore-400">
      <NavbarBrand className="h-12">
        <div className="w-12 h-12 mr-2">
          <LearningHubLogo />
        </div>
        <NextLink href={getRouteForDashboard()}>
          <h1 className="text-xl text-white">Learning Hub</h1>
        </NextLink>
      </NavbarBrand>
      <NavbarContent>
        <NavbarContent>
          {session?.user ? (
            <>
              <NavbarItem
                as={NextLink}
                href={getRouteForDashboard()}
                className="text-white"
              >
                Dashboard
              </NavbarItem>
              <NavbarItem
                as={NextLink}
                href={getRouteForAllFlashcardLists()}
                className="text-white"
              >
                Flashcards
              </NavbarItem>
              <NavbarItem
                as={NextLink}
                href={getRouteForAllTexts()}
                className="text-white"
              >
                Texts
              </NavbarItem>
              <NavbarContent>{supabase && <NavbarAvatar />}</NavbarContent>
            </>
          ) : (
            <NavbarContent justify="end">
              <Button
                as={NextLink}
                href={"/login"}
                size={"sm"}
                variant="flat"
                className="bg-ore-200"
              >
                Login
              </Button>
            </NavbarContent>
          )}
        </NavbarContent>
      </NavbarContent>
    </Navbar>
  );
}
