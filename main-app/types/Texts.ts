import { WithId } from "mongodb";

export interface TextDocument extends WithId<Document> {
  name: string;
  updatedAt: string;
  content?: string;
  owner: string;
}
