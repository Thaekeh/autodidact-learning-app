import {
  Col,
  Container,
  Input,
  Modal,
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
  const { data: lists } = await supabase.from("flashcardLists").select();

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

  const { visible, setVisible } = useModal(false);
  const newTextButtonHandler = () => {
    setVisible(true);
  };

  const onNewTextConfirm = async (name: string) => {
    const baseUrl = window.location.origin;
    console.log(`baseUrl`, baseUrl);
    const result = await fetch(`${baseUrl}/api/texts/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    const data = await result.json();
    if (data) {
      const textUrl = `${window.location.origin}/text/${data.id}`;
      router.push(textUrl);
    }
  };

  return (
    <>
      <NameModal
        title={"Insert name of text"}
        isOpen={visible}
        onCancel={() => setVisible(false)}
        onConfirm={onNewTextConfirm}
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
                  texts.map((text) => (
                    <React.Fragment key={text.id}>
                      <ItemCard
                        name={text.name}
                        href={getRouteForSingleText(text.id)}
                      />
                      <Spacer y={1}></Spacer>
                    </React.Fragment>
                  ))}
              </Col>
            </DashboardCardContainer>
          </Col>
          <Spacer x={2} />
          <Col>
            <DashboardCardContainer>
              <Row align="center" justify="space-between">
                <h2>Card Lists</h2>
                <Tooltip content={"Create new list"}>
                  <IconButton>
                    <Plus />
                  </IconButton>
                </Tooltip>
              </Row>
              {lists &&
                lists.map((list) => (
                  <React.Fragment key={list.id}>
                    <ItemCard
                      name={list.name}
                      href={getRouteForFlashcardList(list.id)}
                    />
                    <Spacer y={1}></Spacer>
                  </React.Fragment>
                ))}
            </DashboardCardContainer>
          </Col>
        </Row>
      </Container>
    </>
  );
}
