"use client";
import { Button, Spacer, Tooltip, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Plus } from "react-feather";
import { useRouter } from "next/navigation";
import { NameModal } from "components/modals/NameModal";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { NextApiRequest, NextApiResponse } from "next";
import { Database } from "types/supabase";
import { TextRow } from "types/Texts";
import { FlashcardListRow } from "types/FlashcardLists";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  createNewFlashcardList,
  deleteListWithMatchingFlashcards,
  getListsForUser,
  getRouteForFlashcardList,
  getRouteForSingleText,
  setListName,
} from "utils";
import {
  deleteTextAndAttachedFiles,
  getTexts,
  setTextName,
} from "utils/supabase/texts";
import { RowType, SimpleTable } from "components/table/SimpleTable";
import { useConfirm } from "hooks/useConfirm";
import { NewTextModal } from "components/modals/texts/NewTextModal";

export default function Dashboard() {
  const [texts, setTexts] = useState<TextRow[] | null>(null);
  const [lists, setLists] = useState<FlashcardListRow[] | null>(null);

  const supabaseClient = createClientComponentClient();

  useEffect(() => {
    getTexts(supabaseClient).then((texts) => setTexts(texts));
    getListsForUser(supabaseClient).then((lists) => setLists(lists));
  }, []);

  const {
    isOpen: textModalIsVisible,
    onOpen: setTextModalIsVisible,
    onOpenChange: onTextModalIsOpenChange,
  } = useDisclosure();
  const {
    isOpen: listModalIsVisible,
    onOpen: setListModalIsVisible,
    onOpenChange: onListModalIsOpenChange,
  } = useDisclosure();

  const refetchTexts = async () => {
    const newTexts = await getTexts(supabaseClient);
    setTexts(newTexts);
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

  const simpleMappedItems = (items: TextRow[] | FlashcardListRow[] | null) => {
    if (!items) return [];
    return items.map((item) => {
      const isTextRow = Object.keys(item).includes("content");
      return {
        id: item.id,
        name: item.name,
        type: isTextRow ? RowType.text : RowType.list,
      };
    });
  };

  const { isConfirmed } = useConfirm();

  const handleDeleteText = async (id: string) => {
    const confirmed = await isConfirmed("Are you sure?");
    if (confirmed) {
      await deleteTextAndAttachedFiles(supabaseClient, id);
      refetchTexts();
    }
  };

  const handleDeleteList = async (id: string) => {
    const confirmed = await isConfirmed("Are you sure?");
    if (confirmed) {
      await deleteListWithMatchingFlashcards(supabaseClient, id);
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

  return (
    <>
      <NewTextModal
        isOpen={textModalIsVisible}
        onOpenChange={onTextModalIsOpenChange}
      />
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

      <div className="grid grid-cols-2 max-md:grid-cols-1 m-auto gap-4 max-w-screen-lg w-screen p-4">
        <div>
          <div className="flex flex-row items-center justify-between">
            <h3>Recent texts</h3>
            <Tooltip content={"Create new text"}>
              <Button
                radius="full"
                variant="light"
                isIconOnly
                onPress={setTextModalIsVisible}
              >
                <Plus />
              </Button>
            </Tooltip>
          </div>
          <SimpleTable
            items={simpleMappedItems(texts)}
            deleteCallback={handleDeleteText}
            openHrefFunction={(id) => getRouteForSingleText(id)}
            editCallback={(id) => {
              setRenameModalSettings({
                isOpen: true,
                name: texts?.find((text) => text.id === id)?.name,
                callback: async (name) => {
                  await setTextName(supabaseClient, id, name);
                  refetchTexts();
                },
              });
            }}
          />
        </div>
        <div>
          <div className="flex flex-row items-center justify-between">
            <h3>Card Lists</h3>
            <Tooltip content={"Create new list"}>
              <Button
                radius="full"
                variant="light"
                isIconOnly
                onPress={setListModalIsVisible}
              >
                <Plus />
              </Button>
            </Tooltip>
          </div>
          <SimpleTable
            items={simpleMappedItems(lists)}
            deleteCallback={handleDeleteList}
            openHrefFunction={(id) => getRouteForFlashcardList(id)}
            editCallback={(id) =>
              setRenameModalSettings({
                isOpen: true,
                name: lists?.find((list) => list.id === id)?.name,
                callback: async (name) => {
                  await setListName(supabaseClient, id, name);
                  refetchLists();
                },
              })
            }
          />
        </div>
      </div>
    </>
  );
}
