import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import absoluteUrl from "next-absolute-url";
import nextConnect from "next-connect";
import { TextDocument, TextObject } from "../../../types/Texts";
import { getUserIdFromReq } from "../../../util";
import getTextById from "../../../util/mongo/texts/getTextById";
import createText from "../../../util/mongo/texts/setTextById";

interface NextApiResponseWithInsertedId extends NextApiResponse {
  insertedId: ObjectId;
}

export default nextConnect<NextApiRequest, NextApiResponseWithInsertedId>({
  onNoMatch(req, res) {
    res.status(404).json({ error: `Document not found from ${req.method}` });
  },
  onError(error, req, res) {
    res.status(500).json({ error: `something went wrong, ${error}` });
  },
}).post(async (req, res) => {
  const name: string = req.body.name;

  const userId = await getUserIdFromReq(req);
  if (!userId) {
    res.status(500).json({ error: `could not find userId` });
    return;
  }

  const newText: TextObject = {
    name,
    updatedAt: Date.now(),
    owner: userId,
    content: "test",
  };

  const result = await createText(newText);
  const baseUrl = absoluteUrl(req).origin;
  const response = {
    id: result.insertedId,
  };

  res.status(201).json(response);
});
