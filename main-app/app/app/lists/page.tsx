"use client";
import { Button, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Plus } from "react-feather";
import { useConfirm } from "hooks/useConfirm";
import { FlashcardListRow } from "types";
import {
  createNewFlashcardList,
  deleteList,
  getListsForUser,
  getRouteForFlashcardList,
  setListName,
} from "utils";
import { NameModal } from "components/modals/NameModal";
import { RowType, SimpleTable } from "components/table/SimpleTable";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Lists() {
  const [lists, setLists] = useState<FlashcardListRow[]>([]);
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

  const [renameModalSettings, setRenameModalSettings] = useState<{
    isOpen: boolean;
    callback: (name: string) => void;
    name?: string;
  }>({
    isOpen: false,
    callback: () => {},
    name: "",
  });

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
      {renameModalSettings.isOpen && (
        <NameModal
          title={"Rename"}
          isOpen={renameModalSettings.isOpen}
          initalName={renameModalSettings.name}
          onOpenChange={() =>
            setRenameModalSettings({
              isOpen: false,
              name: "",
              callback: () => {},
            })
          }
          onConfirm={(name) => {
            renameModalSettings.callback(name);
            setRenameModalSettings({
              isOpen: false,
              name: "",
              callback: () => {},
            });
          }}
        />
      )}
      <div className="container mx-auto mt-12 max-w-screen-lg">
        <div className="container mx-auto flex justify-between items-center mb-6">
          <h3>Your lists</h3>
          <Button
            onPress={setListModalIsVisible}
            size={"md"}
            endContent={<Plus size={16} />}
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
          editCallback={(id) => {
            setRenameModalSettings({
              isOpen: true,
              name: lists.find((text) => text.id === id)?.name,
              callback: async (name) => {
                await setListName(supabaseClient, id, name);
                refetchLists();
              },
            });
          }}
        ></SimpleTable>
      </div>
    </>
  );
}
