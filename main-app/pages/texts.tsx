import { css } from "@emotion/react";
import {
  Button,
  Card,
  Col,
  Container,
  Grid,
  Row,
  Text,
  Textarea,
} from "@nextui-org/react";
import React, { useState } from "react";
import styled from "@emotion/styled";
import { Edit2 } from "react-feather";

export default function Texts() {
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [text, setText] = useState<string>(
    "This is some testing text with a longer content"
  );

  const handleTextClick = (event: React.MouseEvent<HTMLSpanElement>) => {
    console.log(event?.currentTarget.innerHTML);
  };

  const mappedText = () => {
    const textInArray = text.split(" ");
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
          {/* <Button onPress={() => setisInEditMode(!isInEditMode)}>
            Toggle editmode
          </Button> */}
          <Card.Body>
            {isInEditMode ? (
              <>
                <Text h4>Edit your text</Text>
                <Textarea
                  animated={false}
                  value={text}
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

const HoverableWord = styled.span`
  padding: 1px;
  box-sizing: border-box;
  :hover {
    background-color: #8686ff;
    cursor: pointer;
    border-radius: 3px;
  }
`;
