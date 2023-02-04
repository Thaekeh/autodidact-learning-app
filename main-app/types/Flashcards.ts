import { WithId } from "mongodb";

export interface FlashcardDocument extends WithId<Document> {
  name: string;
  updatedAt: string;
  listId: string;
}
