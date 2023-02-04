import { Container, Table } from "@nextui-org/react";
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
  flashcards: FlashcardDocument[];
}) {
  return (
    <Container>
      <div>{list?.name}</div>
      <Table>
        <Table.Header>
          <Table.Column>Name</Table.Column>
          <Table.Column>Last opened</Table.Column>
          <Table.Column> </Table.Column>
        </Table.Header>
        <Table.Body>
          {flashcards?.map((flashcard) => {
            return (
              <Table.Row>
                <Table.Cell>test</Table.Cell>
                <Table.Cell>test</Table.Cell>
                <Table.Cell>test</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
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
  console.log(`flashcards`, flashcards);
  return { props: { list: list || null, flashcards: flashcards } };
}
