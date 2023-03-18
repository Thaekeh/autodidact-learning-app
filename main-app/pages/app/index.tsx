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
import React from "react";
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
  getListsForUser,
  getRouteForSingleText,
} from "../../util";
import { createNewText } from "../../util/supabase/texts";
import { SimpleTable } from "../../components/table/SimpleTable";

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

  const { data: texts } = await supabase.from("texts").select();
  const lists = await getListsForUser(supabase);

  return { props: { texts, lists } };
}

export default function Dashboard({
  texts,
  lists,
}: {
  texts: TextRow[];
  lists: FlashcardListRow[];
}) {
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

  const simpleMappedItems = (items: TextRow[] | FlashcardListRow[]) => {
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
    // router.push(getRouteForSingleText(id));
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
      {/* <ConfirmModal onConfirm={handleDeleteText} /> */}
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
                deleteCallback={() => console.log("delete")}
                openCallBack={() => console.log("open")}
              />
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  );
}
