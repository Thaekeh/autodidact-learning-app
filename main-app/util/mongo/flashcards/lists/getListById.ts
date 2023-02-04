import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";
import { ListDocument } from "../../../../types/Lists";

export default async function getListById(
  userId?: ObjectId,
  listId?: ObjectId
): Promise<ListDocument | undefined> {
  try {
    if (!userId) {
      console.log("no userId in fetch");
      return;
    }
    if (!listId) {
      console.log("no textId in fetch");
      return;
    }

    const client = await clientPromise;
    const listsCollection = await client
      .db("learningHub")
      .collection("flashcardLists");
    const list = await listsCollection.findOne<ListDocument>({
      _id: listId,
      owner: userId,
    });
    if (!list) {
      throw new Error("list not found");
    }
    if (!list) return undefined;
    return JSON.parse(JSON.stringify(list));
  } catch (e) {
    console.error(e);
  }
}
