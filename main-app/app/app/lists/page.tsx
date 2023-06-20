"use client";
import { Button, Spacer, useDisclosure } from "@nextui-org/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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
import { RowType, SimpleTable } from "components/table/SimpleTable";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Lists() {
  const [lists, setLists] = useState<FlashcardListRow[]>([]);
  const router = useRouter();
  const { isConfirmed } = useConfirm();

  const {
    isOpen: listModalIsVisible,
    onOpen: setListModalIsVisible,
    onOpenChange,
  } = useDisclosure();

  const supabaseClient = createClientComponentClient();

  useEffect(() => {
    getListsForUser(supabaseClient).then((lists) => setLists(lists));
  }, []);

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

  const simpleMappedItems = (items: FlashcardListRow[] | null) => {
    if (!items) return [];
    return items.map((item) => {
      return {
        id: item.id,
        name: item.name,
        type: RowType.list,
      };
    });
  };

  return (
    <>
      <NameModal
        title={"Insert name of list"}
        isOpen={listModalIsVisible}
        onOpenChange={onOpenChange}
        onConfirm={onNewListConfirm}
      />
      <div className="container mx-auto mt-12">
        <div
          className="container mx-auto flex justify-between items-center mb-6"
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
            variant="bordered"
            color="secondary"
          >
            New
          </Button>
        </div>
        <SimpleTable
          items={simpleMappedItems(lists)}
          openCallBack={(id) => router.push(getRouteForFlashcardList(id))}
          deleteCallback={handleDeleteCallback}
          editCallback={() => console.log("TODO- edit callback")}
        ></SimpleTable>
      </div>
    </>
  );
}

// TODO: Fix
// export async function getServerSideProps({
//   req,
//   res,
// }: {
//   req: NextApiRequest;
//   res: NextApiResponse;
// }) {
//   const supabase = await createServerSupabaseClient<Database>({
//     req,
//     res,
//   });

//   const lists = await getListsForUser(supabase);
//   return { props: { lists } };
// }
