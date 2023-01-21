import { Card, Col, Container, Row, Spacer, Tooltip } from "@nextui-org/react";
import { IncomingMessage } from "http";
import { stringify } from "querystring";
import React from "react";
import { Plus, Trash } from "react-feather";
import { IconButton } from "../../components/buttons/IconButton";
import { ItemCard } from "../../components/cards/itemCard";
import clientPromise from "../../lib/mongodb";
import { TextType } from "../../types/Texts";
import { getUserIdFromReq } from "../../util/getUserIdFromReq";
import { connectToDatabase } from "../../util/mongodb";

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
  lists: any;
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
            {/* Add actions to create new text */}
            {texts &&
              texts.map((text) => (
                <React.Fragment key={text._id}>
                  <ItemCard name={text.name} />
                  <Spacer y={1}></Spacer>
                </React.Fragment>
              ))}
          </Col>
        </Col>
        <Spacer x={4} />
        <Col>
          <h2>Cards</h2>
          {lists &&
            lists.map((list) => (
              <React.Fragment key={list._id}>
                <ItemCard name={list.name} />
                <Spacer y={1}></Spacer>
              </React.Fragment>
            ))}
        </Col>
      </Row>
    </Container>
  );
}
