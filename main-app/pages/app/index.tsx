import { Col, Container, Row, Spacer, Tooltip } from "@nextui-org/react";
import { IncomingMessage } from "http";
import React from "react";
import { Plus } from "react-feather";
import { IconButton } from "../../components/buttons/IconButton";
import { ItemCard } from "../../components/cards/ItemCard";
import { ListType } from "../../types/Lists";
import { TextType } from "../../types/Texts";
import { getUserIdFromReq } from "../../util/getUserIdFromReq";
import { connectToDatabase } from "../../util/mongodb";
import { getRouteForSingleCardList } from "../../util/routing/cardLists";
import { getRouteForSingleText } from "../../util/routing/texts";

export async function getServerSideProps({ req }: { req: IncomingMessage }) {
  const { db } = await connectToDatabase();
  const userId = await getUserIdFromReq(req);
  const textsCollection = await db.collection("texts");
  const texts = await textsCollection.find({ userId }).limit(10).toArray();
  const textsAsJson = JSON.parse(JSON.stringify(texts));

  const listsCollection = await db.collection("flashcardLists");
  const lists = await listsCollection.find({ userId }).limit(10).toArray();
  const listsAsJson = JSON.parse(JSON.stringify(lists));

  return { props: { texts: textsAsJson, lists: listsAsJson } };
}

export default function Dashboard({
  texts,
  lists,
}: {
  texts: TextType[];
  lists: ListType[];
}) {
  return (
    <Container>
      <Spacer y={2} />
      <Row>
        <Col>
          <Row align="center" justify="space-between">
            <h2>Texts</h2>
            <Tooltip content={"Create new text"}>
              <IconButton>
                <Plus />
              </IconButton>
            </Tooltip>
          </Row>
          <Col>
            {texts &&
              texts.map((text) => (
                <React.Fragment key={text._id}>
                  <ItemCard
                    name={text.name}
                    href={getRouteForSingleText(text._id)}
                  />
                  <Spacer y={1}></Spacer>
                </React.Fragment>
              ))}
          </Col>
        </Col>
        <Spacer x={4} />
        <Col>
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
              <React.Fragment key={list._id}>
                <ItemCard
                  name={list.name}
                  href={getRouteForSingleCardList(list._id)}
                />
                <Spacer y={1}></Spacer>
              </React.Fragment>
            ))}
        </Col>
      </Row>
    </Container>
  );
}
