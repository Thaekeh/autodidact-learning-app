import { WithId } from "mongodb";

// This is necessary to make the mongo data usable in Next.
// https://stackoverflow.com/questions/66817759/next-js-error-serializing-res-returned-from-getserversideprops
export default function stringifyAndParseResult(
  data: WithId<Document> | WithId<Document>[]
) {
  return JSON.parse(JSON.stringify(data));
}
