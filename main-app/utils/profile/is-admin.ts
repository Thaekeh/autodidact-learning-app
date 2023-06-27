import { ProfileRow } from "types";

export const isAdmin = (user?: ProfileRow | null) => {
  return !!user?.isAdmin;
};
