import { Container } from "@nextui-org/react";
import React from "react";
import { IncomingMessage } from "http";
import { getUserIdFromReq } from "../../util";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import getListById from "../../util/mongo/flashcards/lists/getListById";
import { ListDocument } from "../../types/Lists";
import getFlashcardsForList from "../../util/mongo/flashcards/flashcards/getFlashcardsForList";
import { FlashcardDocument } from "../../types/Flashcards";
import { ObjectId } from "mongodb";

export default function TextPage({
  list,
  flashcards,
}: {
  list: ListDocument | null;
  flashcards: FlashcardDocument[] | null;
}) {
  return (
    <Container>
      <div>{list?.name}</div>
      <div>{flashcards?.length}</div>
    </Container>
  );
}

export async function getServerSideProps({
  req,
  params,
}: {
  req: IncomingMessage;
  params: Params;
}) {
  const userId = await getUserIdFromReq(req);
  const listId = new ObjectId(params.list[0]);
  const list = await getListById(userId, listId);

  const flashcards = await getFlashcardsForList(userId, listId);
  return { props: { list: list || null, flashcards: flashcards } };
}
