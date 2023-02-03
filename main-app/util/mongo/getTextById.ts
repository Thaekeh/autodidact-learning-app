import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";

export default async function getTextById(
  userId?: string,
  id?: string
): Promise<Text | undefined> {
  try {
    if (!userId) {
      console.log("no userId in fetch");
      return;
    } else if (!id) {
      console.log("no textId in fetch");
      return;
    } else {
      console.log("userId", userId);
      console.log("id", id);
      const client = await clientPromise;
      const textsCollection = await client
        .db("learningHub")
        .collection("texts");
      console.log("object Id ", new ObjectId(id));
      const text = await textsCollection.findOne({ _id: new ObjectId(id) });
      console.log(`text`, text);
      if (!text) return undefined;
      return JSON.parse(JSON.stringify(text));
    }
  } catch (e) {
    console.error(e);
  }
}
