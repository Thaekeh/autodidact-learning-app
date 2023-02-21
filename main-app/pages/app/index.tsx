import {
  Col,
  Container,
  Input,
  Modal,
  Row,
  Spacer,
  Tooltip,
  useModal,
  Text,
  Button,
  useInput,
} from "@nextui-org/react";
import { IncomingMessage } from "http";
import React from "react";
import { Plus } from "react-feather";
import { IconButton } from "../../components/buttons/IconButton";
import { ItemCard } from "../../components/cards/ItemCard";
import { ListDocument } from "../../types/Lists";
import { TextDocument } from "../../types/Texts";
import { getUserIdFromReq } from "../../util/getUserIdFromReq";
import getListsForUser from "../../util/mongo/flashcards/lists/getListsForUser";
import getTextsForUser from "../../util/mongo/texts/getTextsForUser";
import { getRouteForSingleCardList } from "../../util/routing/cardLists";
import { getRouteForSingleText } from "../../util/routing/texts";
import { useRouter } from "next/router";
import { NameModal } from "../../components/modals/NameModal";
import { DashboardCardContainer } from "../../components/cards/DashboardCardContainer";
import { useUser } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "../../lib/database.types";
import { NextApiRequest, NextApiResponse } from "next";

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

  const { data: getUserData } = await supabase.auth.getUser();
  console.log("user from server", getUserData.user);

  const { data: textsData, error } = await supabase.from("texts").select();

  console.log(`textsData`, textsData);

  const userId = await getUserIdFromReq(req);

  const texts = await getTextsForUser(userId);
  const lists = await getListsForUser(userId);

  return { props: { texts, lists } };
}

export default function Dashboard({
  texts,
  lists,
}: {
  texts: TextDocument[];
  lists: ListDocument[];
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
                    <React.Fragment key={text._id.toString()}>
                      <ItemCard
                        name={text.name}
                        href={getRouteForSingleText(text._id.toString())}
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
                  <React.Fragment key={list._id.toString()}>
                    <ItemCard
                      name={list.name}
                      href={getRouteForSingleCardList(list._id.toString())}
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
