"use client";
import { Button, useDisclosure } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Plus } from "react-feather";
import { useConfirm } from "hooks/useConfirm";
import { FlashcardListRow } from "types";
import {
  createNewFlashcardList,
  deleteList,
  getListsForUser,
  getRouteForFlashcardList,
} from "utils";
import { NameModal } from "components/modals/NameModal";
import { RowType, SimpleTable } from "components/table/SimpleTable";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function Lists() {
  const [lists, setLists] = useState<FlashcardListRow[]>([]);
  const router = useRouter();
  const { isConfirmed } = useConfirm();

  const {
    isOpen: listModalIsVisible,
    onOpen: setListModalIsVisible,
    onOpenChange: onListModalIsOpenChange,
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
      onListModalIsOpenChange();
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
        onOpenChange={onListModalIsOpenChange}
        onConfirm={onNewListConfirm}
      />
      <div className="container mx-auto mt-12">
        <div className="container mx-auto flex justify-between items-center mb-6">
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
          openHrefFunction={(id) => getRouteForFlashcardList(id)}
          deleteCallback={handleDeleteCallback}
          editCallback={() => console.log("TODO- edit callback")}
        ></SimpleTable>
      </div>
    </>
  );
}
