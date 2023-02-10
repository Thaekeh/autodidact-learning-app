import {
  Button,
  Card,
  Container,
  Grid,
  Row,
  Textarea,
  Text,
} from "@nextui-org/react";
import React, { useState } from "react";
import { Edit2 } from "react-feather";
import styled from "@emotion/styled";
import { IncomingMessage } from "http";
import { getUserIdFromReq } from "../../util";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import getTextById from "../../util/mongo/texts/getTextById";
import { TextDocument } from "../../types/Texts";
import { ObjectId } from "mongodb";

export default function TextPage({ text }: { text: TextDocument | null }) {
  const [isInEditMode, setIsInEditMode] = useState(false);

  const handleTextClick = (event: React.MouseEvent<HTMLSpanElement>) => {
    console.log(event?.currentTarget.innerHTML);
  };

  const mappedText = () => {
    if (!text?.content) return "Empty";
    const textInArray = text.content.split(" ");
    return textInArray.map((word) => {
      const randomNumber = Math.floor(Math.random() * 100000);
      return (
        <React.Fragment key={`${word}-${randomNumber}`}>
          <HoverableWord onClick={handleTextClick}>{word}</HoverableWord>
          &nbsp;
        </React.Fragment>
      );
    });
  };

  const setText = (inputText: string) => {};

  return (
    <Grid.Container
      gap={2}
      justify="center"
      css={{ marginTop: `2rem`, width: `100vw`, margin: 0 }}
    >
      <Grid
        xs
        css={{
          maxHeight: `80vh`,
          height: `80vh`,
        }}
      >
        <Card>
          <Card.Body>
            {isInEditMode ? (
              <>
                <Text h4>Edit your text</Text>
                <Textarea
                  animated={false}
                  value={text?.content || ""}
                  onChange={(event) => setText(event.target.value)}
                  maxRows={50}
                ></Textarea>
              </>
            ) : (
              <>
                <Text h4>Click on any word</Text>
                <Container wrap="wrap" css={{ maxWidth: `100%` }}>
                  <Text css={{ display: `flex`, flexWrap: `wrap` }}>
                    {mappedText()}
                  </Text>
                </Container>
              </>
            )}
          </Card.Body>
          <Card.Divider />
          <Card.Footer>
            <Row justify="flex-end">
              <Button size="xs" light>
                Cancel
              </Button>
              <Button icon size="sm" rounded>
                <Edit2 onClick={() => setIsInEditMode(!isInEditMode)}></Edit2>
              </Button>
            </Row>
          </Card.Footer>
        </Card>
      </Grid>
      <Grid xs>
        <h1>Test</h1>
      </Grid>
    </Grid.Container>
  );
}

export async function getServerSideProps({
  req,
  params,
}: {
  req: IncomingMessage;
  params: Params;
}) {
  const userId = await getUserIdFromReq(req);
  const textId = new ObjectId(params.text[0]);
  const text = await getTextById(userId, textId);
  return { props: { text: text || null } };
}

const HoverableWord = styled.span`
  padding: 1px;
  box-sizing: border-box;
  :hover {
    background-color: #8686ff;
    cursor: pointer;
    border-radius: 3px;
  }
`;
