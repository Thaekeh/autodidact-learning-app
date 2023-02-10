import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { getUserIdFromReq } from "../../../util";
import setTextById from "../../../util/mongo/texts/setTextById";
import getTextById from "../../../util/mongo/texts/getTextById";

export default nextConnect<NextApiRequest, NextApiResponse>({
  onNoMatch(req, res) {
    res.status(404).json({ error: `Document not found from ${req.method}` });
  },
  onError(error, req, res) {
    res.status(500).json({ error: `something went wrong, ${error}` });
  },
}).get(async (req, res) => {
  let { text: textId } = req.query;
  const textObjectId = typeof textId === "string" && new ObjectId(textId);
  if (!textObjectId) throw new Error("could not create objectId");
  const userId = await getUserIdFromReq(req);
  const text = await getTextById(userId, textObjectId);
  res.status(200).json({ text });
});
