import { Button, Spacer, useDisclosure } from "@nextui-org/react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/navigation";
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

  const {
    isOpen: listModalIsVisible,
    onOpen: setListModalIsVisible,
    onOpenChange,
  } = useDisclosure();

  // const { visible: listModalIsVisible, setVisible: setListModalIsVisible } =
  //   useModal(false);

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
      setListModalIsVisible;
      refetchLists();
    }
  };

  return (
    <>
      <NameModal
        title={"Insert name of list"}
        isOpen={listModalIsVisible}
        onCancel={setListModalIsVisible}
        onConfirm={onNewListConfirm}
      />
      <div className="container mx-auto">
        <Spacer y={2}></Spacer>
        <div
          className="container mx-auto"
          // display="flex"
          // direction="row"
          // justify="space-between"
          // alignContent="center"
        >
          <h3>Your lists</h3>
          <Button
            onPress={setListModalIsVisible}
            size={"md"}
            endIcon={<Plus size={16} />}
          >
            Create New
          </Button>
        </div>
        <FullTable
          items={lists}
          openCallBack={(id) => router.push(getRouteForFlashcardList(id))}
          deleteCallback={handleDeleteCallback}
        ></FullTable>
      </div>
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
