import clientPromise from "../../../lib/mongodb";
import { TextDocument } from "../../../types/Texts";
import stringifyAndParseResult from "../stringifyAndParseResult";

export default async function getTextsForUser(userId?: string) {
  if (!userId) {
    console.log("no userId in fetch");
    return;
  }

  const client = await clientPromise;
  const textsCollection = await client.db("learningHub").collection("texts");
  const texts = await textsCollection
    .find<TextDocument>({
      owner: userId,
    })
    .toArray();

  return stringifyAndParseResult(texts);
}
