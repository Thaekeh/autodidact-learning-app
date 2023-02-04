import { WithId } from "mongodb";

export interface ListDocument extends WithId<Document> {
  name: string;
  updatedAt: string;
}
