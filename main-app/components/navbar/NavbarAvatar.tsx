import { Avatar, Dropdown, Text, Navbar } from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Key } from "react";
import { User } from "react-feather";

interface Props {}
export const NavbarAvatar: React.FC<Props> = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const user = sessionData?.user;

  const onDropdownAction = (actionKey: Key) => {
    switch (actionKey) {
      case "logout":
        signOut({ redirect: false });
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
            text={user?.name || ""}
            icon={user?.name ? undefined : <User />}
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
