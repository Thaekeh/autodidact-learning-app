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
  deleteList,
  getListsForUser,
  getRouteForFlashcardList,
  getRouteForSingleText,
} from "utils";
import { createNewText, deleteText, getTexts } from "utils/supabase/texts";
import { SimpleTable } from "components/table/SimpleTable";
import { useConfirm } from "hooks/useConfirm";

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
      refetchLists();
    }
  };

  const simpleMappedItems = (items: TextRow[] | FlashcardListRow[] | null) => {
    if (!items) return [];
    return items.map((item) => {
      return {
        id: item.id,
        name: item.name,
      };
    });
  };

  const { isConfirmed } = useConfirm();

  const handleDeleteText = async (id: string) => {
    const confirmed = await isConfirmed("Are you sure?");
    if (confirmed) {
      await deleteText(supabaseClient, id);
      refetchTexts();
    }
  };

  const handleDeleteList = async (id: string) => {
    const confirmed = await isConfirmed("Are you sure?");
    if (confirmed) {
      await deleteList(supabaseClient, id);
      refetchLists();
    }
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
              />
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  );
}
