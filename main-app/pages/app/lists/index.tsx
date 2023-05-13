import { Button, Container, Spacer, Text, useModal } from "@nextui-org/react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Plus } from "react-feather";
import { FullTable } from "components/table/FullTable";
import { useConfirm } from "hooks/useConfirm";
import { Database, FlashcardListRow } from "types";
import {
  createNewFlashcardList,
  deleteList,
  getListsForUser,
  getRouteForFlashcardList,
} from "utils";
import { NameModal } from "components/modals/NameModal";

export default function Lists({
  lists: listsProp,
}: {
  lists: FlashcardListRow[];
}) {
  const [lists, setLists] = useState(listsProp);
  const router = useRouter();
  const { isConfirmed } = useConfirm();

  const { visible: listModalIsVisible, setVisible: setListModalIsVisible } =
    useModal(false);

  const supabaseClient = useSupabaseClient();

  const handleDeleteCallback = async (id: string) => {
    const confirmed = await isConfirmed("Are you sure?");
    if (confirmed) {
      await deleteList(supabaseClient, id);
      const newLists = await getListsForUser(supabaseClient);
      setLists(newLists);
    }
  };

  const refetchLists = async () => {
    const newLists = await getListsForUser(supabaseClient);
    setLists(newLists);
  };

  const onNewListConfirm = async (name: string) => {
    const createdDocument = await createNewFlashcardList(supabaseClient, name);
    if (createdDocument) {
      setListModalIsVisible(false);
      refetchLists();
    }
  };

  return (
    <>
      <NameModal
        title={"Insert name of list"}
        isOpen={listModalIsVisible}
        onCancel={() => setListModalIsVisible(false)}
        onConfirm={onNewListConfirm}
      />
      <Container>
        <Spacer y={2}></Spacer>
        <Container
          display="flex"
          direction="row"
          justify="space-between"
          alignContent="center"
        >
          <Text h3>Your lists</Text>
          <Button
            onClick={() => setListModalIsVisible(true)}
            size={"md"}
            icon={<Plus size={16} />}
          >
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
