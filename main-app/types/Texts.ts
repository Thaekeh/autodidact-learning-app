import { ObjectId, WithId } from "mongodb";

export interface TextObject {
  name: string;
  updatedAt: number;
  content?: string;
  owner: ObjectId;
}

export type TextDocument = TextObject & WithId<Document>;
