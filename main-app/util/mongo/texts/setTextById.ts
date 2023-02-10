import { InsertOneResult } from "mongodb";
import clientPromise from "../../../lib/mongodb";
import { TextDocument, TextObject } from "../../../types/Texts";

export default async function createText(
  text: TextObject
): Promise<InsertOneResult<Document>> {
  const client = await clientPromise;
  const textsCollection = await client.db("learningHub").collection("texts");
  return await textsCollection.insertOne(text);
}
