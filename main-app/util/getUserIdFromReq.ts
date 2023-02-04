import { IncomingMessage } from "http";
import { ObjectId } from "mongodb";
import { getSession } from "next-auth/react";

export const getUserIdFromReq = async (
  req: IncomingMessage
): Promise<ObjectId | undefined> => {
  const session = await getSession({ req });
  const userId = session?.user?.id;
  return new ObjectId(userId);
};
