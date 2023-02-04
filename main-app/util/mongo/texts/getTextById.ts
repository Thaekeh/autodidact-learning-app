import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";
import { TextDocument } from "../../../types/Texts";

export default async function getTextById(
  userId?: ObjectId,
  textId?: ObjectId
): Promise<TextDocument | undefined> {
  try {
    if (!userId) {
      console.log("no userId in fetch");
      return;
    }
    if (!textId) {
      console.log("no textId in fetch");
      return;
    }

    const client = await clientPromise;
    const textsCollection = await client.db("learningHub").collection("texts");
    const text = await textsCollection.findOne<TextDocument>({
      _id: textId,
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
