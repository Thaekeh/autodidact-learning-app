import {
  Col,
  Container,
  Row,
  Spacer,
  Text,
  Tooltip,
  useModal,
} from "@nextui-org/react";
import React, { useState } from "react";
import { Plus } from "react-feather";
import { IconButton } from "components/buttons/IconButton";
import { useRouter } from "next/router";
import { NameModal } from "components/modals/NameModal";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
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

  const texts = await getTexts(supabase);
  const lists = await getListsForUser(supabase);

  return { props: { textsProp: texts, listsProp: lists } };
}

export default function Dashboard({
  textsProp,
  listsProp,
}: {
  textsProp: TextRow[];
  listsProp: FlashcardListRow[];
}) {
  const [texts, setTexts] = useState<TextRow[] | null>(textsProp);
  const [lists, setLists] = useState<FlashcardListRow[] | null>(listsProp);
  const router = useRouter();

  const supabaseClient = useSupabaseClient();

  const { visible: textModalIsVisible, setVisible: setTextModalIsVisible } =
    useModal(false);
  const { visible: listModalIsVisible, setVisible: setListModalIsVisible } =
    useModal(false);

  const newTextButtonHandler = () => {
    setTextModalIsVisible(true);
  };

  const newListButtonHandler = () => {
    setListModalIsVisible(true);
  };

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
      setListModalIsVisible(false);
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
        onCancel={() => setTextModalIsVisible(false)}
      />
      <NameModal
        title={"Insert name of list"}
        isOpen={listModalIsVisible}
        onCancel={() => setListModalIsVisible(false)}
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

      <Container>
        <Spacer y={2} />
        <Row>
          <Col>
            <Container>
              <Row align="center" justify="space-between">
                <Text h3>Recent texts</Text>
                <Tooltip content={"Create new text"}>
                  <IconButton onClick={newTextButtonHandler}>
                    <Plus />
                  </IconButton>
                </Tooltip>
              </Row>
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
            </Container>
          </Col>
          <Spacer x={2} />
          <Col>
            <Container>
              <Row align="center" justify="space-between">
                <Text h3>Card Lists</Text>
                <Tooltip content={"Create new list"}>
                  <IconButton onClick={newListButtonHandler}>
                    <Plus />
                  </IconButton>
                </Tooltip>
              </Row>
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
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  );
}
