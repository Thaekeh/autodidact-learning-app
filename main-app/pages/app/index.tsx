import {
  Col,
  Container,
  Row,
  Spacer,
  Table,
  Text,
  theme,
  Tooltip,
  useModal,
} from "@nextui-org/react";
import React, { useState } from "react";
import { Plus } from "react-feather";
import { IconButton } from "../../components/buttons/IconButton";
import { useRouter } from "next/router";
import { NameModal } from "../../components/modals/NameModal";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { Database } from "../../types/supabase";
import { TextRow } from "../../types/Texts";
import { FlashcardListRow } from "../../types/FlashcardLists";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  createNewFlashcardList,
  deleteList,
  getListsForUser,
  getRouteForSingleText,
} from "../../util";
import { createNewText, deleteText, getTexts } from "../../util/supabase/texts";
import { SimpleTable } from "../../components/table/SimpleTable";
import { ConfirmModal } from "../../components/modals/ConfirmModal";

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

  return { props: { textsProp: texts, lists } };
}

export default function Dashboard({
  textsProp,
  lists,
}: {
  textsProp: TextRow[];
  lists: FlashcardListRow[];
}) {
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>(
    undefined
  );
  const [texts, setTexts] = useState<TextRow[] | null>(textsProp);
  const router = useRouter();

  const supabaseClient = useSupabaseClient();

  const { visible: textModalIsVisible, setVisible: setTextModalIsVisible } =
    useModal(false);
  const { visible: listModalIsVisible, setVisible: setListModalIsVisible } =
    useModal(false);
  const {
    visible: textDeleteConfirmModalIsOpen,
    setVisible: setTextDeleteConfirmModalIsOpen,
  } = useModal(false);
  const {
    visible: listDeleteConfirmModalIsOpen,
    setVisible: setListDeleteConfirmModalIsOpen,
    bindings: {},
  } = useModal(false);

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

  const onNewTextConfirm = async (name: string) => {
    const createdDocument = await createNewText(supabaseClient, name);
    if (createdDocument) {
      const textUrl = getRouteForSingleText(createdDocument.id);
      router.push(textUrl);
    }
  };

  const onNewListConfirm = async (name: string) => {
    const createdDocument = await createNewFlashcardList(supabaseClient, name);
    if (createdDocument) {
      setListModalIsVisible(false);
    }
  };

  const simpleMappedItems = (items: TextRow[] | FlashcardListRow[] | null) => {
    if (!items) return;
    return items.map((item) => {
      return {
        id: item.id,
        name: item.name,
      };
    });
  };

  const openText = (id: string) => {
    router.push(getRouteForSingleText(id));
  };

  const handleDeleteText = (id: string) => {
    setSelectedItemId(id);
    setTextDeleteConfirmModalIsOpen(true);
  };

  const handleDeleteList = (id: string) => {
    setSelectedItemId(id);
    setListDeleteConfirmModalIsOpen(true);
  };

  const confirmDeleteText = async () => {
    setTextDeleteConfirmModalIsOpen(false);
    if (!selectedItemId) return;
    await deleteText(supabaseClient, selectedItemId);
    refetchTexts();
  };

  const confirmDeleteList = () => {
    if (!selectedItemId) return;
    deleteList(supabaseClient, selectedItemId);
  };

  return (
    <>
      <NameModal
        title={"Insert name of text"}
        isOpen={textModalIsVisible}
        onCancel={() => setTextModalIsVisible(false)}
        onConfirm={onNewTextConfirm}
      />
      <NameModal
        title={"Insert name of list"}
        isOpen={listModalIsVisible}
        onCancel={() => setListModalIsVisible(false)}
        onConfirm={onNewListConfirm}
      />
      <ConfirmModal
        onCancel={() => setTextDeleteConfirmModalIsOpen(false)}
        isOpen={textDeleteConfirmModalIsOpen}
        onConfirm={confirmDeleteText}
      />
      <ConfirmModal
        onCancel={() => setListDeleteConfirmModalIsOpen(false)}
        isOpen={listDeleteConfirmModalIsOpen}
        onConfirm={confirmDeleteList}
      />
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
                openCallBack={openText}
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
                openCallBack={() => console.log("open")}
              />
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  );
}
