import { Button, Container, Spacer, Text } from "@nextui-org/react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Plus } from "react-feather";
import { FullTable } from "../../../components/table/FullTable";
import { useConfirm } from "../../../hooks/useConfirm";
import { Database, FlashcardListRow } from "../../../types";
import {
  deleteList,
  getListsForUser,
  getRouteForFlashcardList,
} from "../../../util";

export default function Lists({
  lists: listsProp,
}: {
  lists: FlashcardListRow[];
}) {
  const [lists, setLists] = useState(listsProp);
  const router = useRouter();
  const { isConfirmed } = useConfirm();

  const supabaseClient = useSupabaseClient();

  const handleDeleteCallback = async (id: string) => {
    const confirmed = await isConfirmed("Are you sure?");
    if (confirmed) {
      await deleteList(supabaseClient, id);
      const newLists = await getListsForUser(supabaseClient);
      setLists(newLists);
    }
  };

  return (
    <>
      <Container>
        <Spacer y={2}></Spacer>
        <Container
          display="flex"
          direction="row"
          justify="space-between"
          alignContent="center"
        >
          <Text h3>Your lists</Text>
          <Button size={"md"} icon={<Plus size={16} />}>
            Create New
          </Button>
        </Container>
        <FullTable
          items={lists}
          openCallBack={(id) => router.push(getRouteForFlashcardList(id))}
          deleteCallback={handleDeleteCallback}
        ></FullTable>
      </Container>
    </>
  );
}

export async function getServerSideProps({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  const supabase = await createServerSupabaseClient<Database>({
    req,
    res,
  });

  const lists = await getListsForUser(supabase);
  return { props: { lists } };
}
