import {
  Col,
  Container,
  Row,
  Spacer,
  Tooltip,
  useModal,
} from "@nextui-org/react";
import React from "react";
import { Plus } from "react-feather";
import { IconButton } from "../../components/buttons/IconButton";
import { ItemCard } from "../../components/cards/ItemCard";
import { getRouteForFlashcardList } from "../../util/routing/flashcardLists";
import { getRouteForSingleText } from "../../util/routing/texts";
import { useRouter } from "next/router";
import { NameModal } from "../../components/modals/NameModal";
import { DashboardCardContainer } from "../../components/cards/DashboardCardContainer";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { Database } from "../../types/supabase";
import { TextRow } from "../../types/Texts";
import { FlashcardListRow } from "../../types/FlashcardLists";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { createNewFlashcardList, getListsForUser } from "../../util";
import { createNewText } from "../../util/supabase/texts";
import { DateTime } from "luxon";

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
            <DashboardCardContainer>
              <Row align="center" justify="space-between">
                <h2>Texts</h2>
                <Tooltip content={"Create new text"}>
                  <IconButton onClick={newTextButtonHandler}>
                    <Plus />
                  </IconButton>
                </Tooltip>
              </Row>
              <Col>
                {texts &&
                  texts.map((text) => {
                    const lastUpdatedDate = text.last_updated
                      ? DateTime.fromISO(text.last_updated).toLocaleString()
                      : undefined;
                    return (
                      <React.Fragment key={text.id}>
                        <ItemCard
                          name={text.name}
                          href={getRouteForSingleText(text.id)}
                          lastUpdated={lastUpdatedDate}
                        />
                        <Spacer y={1}></Spacer>
                      </React.Fragment>
                    );
                  })}
              </Col>
            </DashboardCardContainer>
          </Col>
          <Spacer x={2} />
          <Col>
            <DashboardCardContainer>
              <Row align="center" justify="space-between">
                <h2>Card Lists</h2>
                <Tooltip content={"Create new list"}>
                  <IconButton onClick={newListButtonHandler}>
                    <Plus />
                  </IconButton>
                </Tooltip>
              </Row>
              {lists &&
                lists.map((list) => {
                  const lastUpdatedDate = list.last_updated
                    ? DateTime.fromISO(list.last_updated).toLocaleString()
                    : undefined;
                  return (
                    <React.Fragment key={list.id}>
                      <ItemCard
                        name={list.name}
                        href={getRouteForFlashcardList(list.id)}
                        lastUpdated={lastUpdatedDate}
                      />
                      <Spacer y={1}></Spacer>
                    </React.Fragment>
                  );
                })}
            </DashboardCardContainer>
          </Col>
        </Row>
      </Container>
    </>
  );
}
