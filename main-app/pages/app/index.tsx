import { Col, Container, Row, Spacer, Tooltip } from "@nextui-org/react";
import { IncomingMessage } from "http";
import React from "react";
import { Plus } from "react-feather";
import { IconButton } from "../../components/buttons/IconButton";
import { ItemCard } from "../../components/cards/ItemCard";
import { connectToDatabase } from "../../lib/mongodb";
import { ListDocument } from "../../types/Lists";
import { TextDocument } from "../../types/Texts";
import { getUserIdFromReq } from "../../util/getUserIdFromReq";
import getListsForUser from "../../util/mongo/flashcards/lists/getListsForUser";
import createNewText from "../../util/mongo/texts/createNewText";
import getTextsForUser from "../../util/mongo/texts/getTextsForUser";
import { getRouteForSingleCardList } from "../../util/routing/cardLists";
import { getRouteForSingleText } from "../../util/routing/texts";

export async function getServerSideProps({ req }: { req: IncomingMessage }) {
  const { db } = await connectToDatabase();
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
  const newTextHandler = () => {
    createNewText();
  };

  return (
    <Container>
      <Spacer y={2} />
      <Row>
        <Col>
          <Row align="center" justify="space-between">
            <h2>Texts</h2>
            <Tooltip content={"Create new text"}>
              <IconButton onClick={newTextHandler}>
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
              <React.Fragment key={list._id.toString()}>
                <ItemCard
                  name={list.name}
                  href={getRouteForSingleCardList(list._id.toString())}
                />
                <Spacer y={1}></Spacer>
              </React.Fragment>
            ))}
        </Col>
      </Row>
    </Container>
  );
}
