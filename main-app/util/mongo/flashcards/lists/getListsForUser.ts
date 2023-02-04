import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";
import { ListDocument } from "../../../../types/Lists";
import stringifyAndParseResult from "../../stringifyAndParseResult";

export default async function getListsForUser(userId?: ObjectId) {
  if (!userId) {
    console.log("no userId while getting lists");
    return;
  }

  const client = await clientPromise;
  const listsCollection = await client
    .db("learningHub")
    .collection("flashcardLists");
  const lists = await listsCollection
    .find<ListDocument>({
      owner: userId,
    })
    .toArray();
  return stringifyAndParseResult(lists);
}
