"use client";
import {
  Avatar,
  Dropdown,
  NavbarItem,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import {
  createClientComponentClient,
  User,
} from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Key, useEffect, useState } from "react";
import { User as UserIcon } from "react-feather";
import { getRouteForProfilePage } from "utils/routing/profile";

interface Props {}
export const NavbarAvatar: React.FC<Props> = () => {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then((user) => {
      setUser(user.data.user);
    });
  }, [supabase]);

  const onDropdownAction = async (actionKey: Key) => {
    switch (actionKey) {
      case "logout":
        await supabase.auth.signOut();
        router.refresh();
        break;
      case "settings":
        router.push(getRouteForProfilePage());
    }
  };

  return (
    <Dropdown placement="bottom-end">
      <NavbarItem>
        <DropdownTrigger>
          <Avatar
            as="button"
            size="md"
            icon={<UserIcon color="white" />}
            color={"secondary"}
          />
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu
        aria-label="User menu actions"
        color="secondary"
        onAction={(actionKey) => onDropdownAction(actionKey)}
        disabledKeys={["profile"]}
      >
        <DropdownItem key="profile" style={{ height: "$18" }}>
          <p>Signed in as</p>
          <p>{user?.email}</p>
        </DropdownItem>
        <DropdownItem key="settings" showDivider>
          My Settings
        </DropdownItem>
        <DropdownItem key="logout" showDivider color="danger">
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
