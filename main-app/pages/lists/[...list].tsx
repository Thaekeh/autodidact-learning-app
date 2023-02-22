import { Container, Table } from "@nextui-org/react";
import React from "react";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../types/supabase";
import { NextApiRequest, NextApiResponse } from "next";
import { FlashcardListRow } from "../../types/FlashcardLists";

export default function TextPage({
  list,
}: {
  list: FlashcardListRow | null;
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
          {/* {flashcards?.map((flashcard) => {
            return (
              <Table.Row>
                <Table.Cell>test</Table.Cell>
                <Table.Cell>test</Table.Cell>
                <Table.Cell>test</Table.Cell>
              </Table.Row>
            );
          })} */}
        </Table.Body>
      </Table>
    </Container>
  );
}

export async function getServerSideProps({
  req,
  res,
  params,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
  params: Params;
}) {
  const supabase = await createServerSupabaseClient<Database>({
    req,
    res,
  });

  const listId = params.list[0];
  const { data: list } = await supabase.from("list").select().eq('id', listId).single();

  // TODO get cards for list


  return { props: { list: list || null } };
}
