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

export default function Flashcards() {
  const [isInEditMode, setisInEditMode] = useState(false);
  const [text, setText] = useState<string>(
    "This is some testing text with a longer content"
  );

  const handleTextClick = (event) => {
    console.log(event?.target.innerHTML);
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
      css={{ marginTop: `2rem`, width: `90vw` }}
    >
      <Grid xs={4}>
        <Card>
          <Button onPress={() => setisInEditMode(!isInEditMode)}>
            Toggle editmode
          </Button>
          <Card.Body>
            {isInEditMode ? (
              <>
                <Text h4>Edit your text</Text>
                <Textarea
                  animated={false}
                  value={text}
                  onChange={(event) => setText(event.target.value)}
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
        </Card>
      </Grid>
      <Grid xs={4}>
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
