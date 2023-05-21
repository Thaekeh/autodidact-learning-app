import { Avatar, Dropdown, Text, Navbar } from "@nextui-org/react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Key } from "react";
import { User } from "react-feather";

interface Props {}
export const NavbarAvatar: React.FC<Props> = () => {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const user = useUser();

  const onDropdownAction = (actionKey: Key) => {
    switch (actionKey) {
      case "logout":
        supabase.auth.signOut();
        router.push("/");
      case "settings":
        router.push("/profile");
    }
  };

  return (
    <Dropdown placement="bottom-right">
      <Navbar.Item>
        <Dropdown.Trigger>
          <Avatar
            bordered
            as="button"
            size="md"
            icon={<User color="white" />}
            color={"secondary"}
          />
        </Dropdown.Trigger>
      </Navbar.Item>
      <Dropdown.Menu
        aria-label="User menu actions"
        color="secondary"
        onAction={(actionKey) => onDropdownAction(actionKey)}
        disabledKeys={["profile"]}
      >
        <Dropdown.Item key="profile" css={{ height: "$18" }}>
          <Text b css={{ d: "flex" }}>
            Signed in as
          </Text>
          <Text b css={{ d: "flex" }}>
            {user?.email}
          </Text>
        </Dropdown.Item>
        <Dropdown.Item key="settings" withDivider>
          My Settings
        </Dropdown.Item>
        <Dropdown.Item key="logout" withDivider color="error">
          Log Out
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
