"use client";
import {
  Button,
  Spacer,
  Tooltip,
  useDisclosure,
  useModal,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Plus } from "react-feather";
// import { IconButton } from "components/buttons/IconButton";
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

//   const texts = await getTexts(supabase);
//   const lists = await getListsForUser(supabase);

//   return { props: { textsProp: texts, listsProp: lists } };
// }

export default function Dashboard({}: // textsProp,
// listsProp,
{
  // textsProp: TextRow[];
  // listsProp: FlashcardListRow[];
}) {
  const [texts, setTexts] = useState<TextRow[] | null>(null);
  const [lists, setLists] = useState<FlashcardListRow[] | null>(null);
  const router = useRouter();

  const supabaseClient = createClientComponentClient();

  useEffect(() => {
    getTexts(supabaseClient).then((texts) => setTexts(texts));
    getListsForUser(supabaseClient).then((lists) => setLists(lists));
    // setTexts(texts);
    // setLists(lists);
  }, []);

  // const { visible: textModalIsVisible, setVisible: setTextModalIsVisible } =
  //   useModal(false);
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
      setListModalIsVisible;
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
        onCancel={setTextModalIsVisible}
      />
      <NameModal
        title={"Insert name of list"}
        isOpen={listModalIsVisible}
        onCancel={setListModalIsVisible}
        onConfirm={onNewListConfirm}
      />
      {renameModalSettings.isOpen && (
        <NameModal
          title={"Rename"}
          isOpen={renameModalSettings.isOpen}
          initalName={renameModalSettings.name}
          onCancel={() =>
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

      <div className="container mx-auto">
        <Spacer y={2} />
        <div>
          <div>
            <div className="container mx-auto">
              <div
              // align="center"
              // justify="space-between"
              >
                <h3>Recent texts</h3>
                <Tooltip content={"Create new text"}>
                  <Button isIconOnly onPress={setTextModalIsVisible}>
                    <Plus />
                  </Button>
                </Tooltip>
              </div>
              <SimpleTable
                items={simpleMappedItems(texts)}
                deleteCallback={handleDeleteText}
                openCallBack={(id) => router.push(getRouteForSingleText(id))}
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
          </div>
          <Spacer x={2} />
          <div>
            <div className="container mx-auto">
              <div
              // align="center" justify="space-between"
              >
                <h3>Card Lists</h3>
                <Tooltip content={"Create new list"}>
                  <Button isIconOnly onPress={setListModalIsVisible}>
                    <Plus />
                  </Button>
                </Tooltip>
              </div>
              <SimpleTable
                items={simpleMappedItems(lists)}
                deleteCallback={handleDeleteList}
                openCallBack={(id) => router.push(getRouteForFlashcardList(id))}
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
        </div>
      </div>
    </>
  );
}
