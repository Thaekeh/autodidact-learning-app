import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";
import { FlashcardDocument } from "../../../../types/Flashcards";
import stringifyAndParseResult from "../../stringifyAndParseResult";

export default async function getFlashcardsForList(
  userId?: string,
  listId?: ObjectId
): Promise<FlashcardDocument[] | undefined> {
  if (!listId) {
    console.log("no listId in fetch");
    return;
  }

  const client = await clientPromise;
  const flashcardsCollection = await client
    .db("learningHub")
    .collection("flashcards");
  const flashcards = await flashcardsCollection
    .find<FlashcardDocument>({
      listId: listId,
      owner: userId?.toString(),
    })
    .toArray();
  return stringifyAndParseResult(flashcards);
}
