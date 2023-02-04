import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";
import { TextDocument } from "../../../types/Texts";

export default async function getTextById(
  userId?: string,
  id?: string
): Promise<TextDocument | undefined> {
  try {
    if (!userId) {
      console.log("no userId in fetch");
      return;
    }
    if (!id) {
      console.log("no textId in fetch");
      return;
    }

    const client = await clientPromise;
    const textsCollection = await client.db("learningHub").collection("texts");
    const text = await textsCollection.findOne<TextDocument>({
      _id: new ObjectId(id),
      owner: userId,
    });
    if (!text) {
      throw new Error("text not found");
    }
    if (!text) return undefined;
    return JSON.parse(JSON.stringify(text));
  } catch (e) {
    console.error(e);
  }
}
