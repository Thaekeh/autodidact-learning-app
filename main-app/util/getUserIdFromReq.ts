import { IncomingMessage } from "http";
import { getSession } from "next-auth/react";

export const getUserIdFromReq = async (
  req: IncomingMessage
): Promise<string | undefined> => {
  const session = await getSession({ req });
  const userId = session?.user?.id;
  return userId;
};
