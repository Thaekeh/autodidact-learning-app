import styled from "@emotion/styled";
import {
  Button,
  Container,
  Spacer,
  StyledButtonGroup,
  Text,
  Textarea,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";

export const TextReader = ({
  textContent,
  handleSaveText,
  handleTextClick,
}: {
  textContent: string;
  handleSaveText: (text: string) => void;
  handleTextClick(event: React.MouseEvent<HTMLSpanElement>): void;
}) => {
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [currentTextContent, setCurrentTextContent] =
    useState<string>(textContent);

  useEffect(() => {
    setCurrentTextContent(textContent);
  }, [textContent]);

  const mappedText = () => {
    if (!currentTextContent) return "Empty";
    const textInArray = textContent.split(" ");
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

  const saveText = () => {
    handleSaveText(currentTextContent);
    setIsInEditMode(false);
  };

  return (
    <>
      {isInEditMode ? (
        <Container direction="column" wrap="wrap">
          <Text h3>Edit your text</Text>
          <StyledButtonGroup>
            <Button onPress={saveText} size={"sm"}>
              Save
            </Button>
          </StyledButtonGroup>
          <Spacer y={1} />
          <Textarea
            animated={false}
            value={currentTextContent}
            onChange={(event) => setCurrentTextContent(event.target.value)}
            maxRows={50}
          ></Textarea>
        </Container>
      ) : (
        <>
          <Container wrap="wrap" css={{ maxWidth: `100%` }}>
            <StyledButtonGroup>
              <Button
                onPress={() => setIsInEditMode(!isInEditMode)}
                size={"sm"}
              >
                Edit
              </Button>
            </StyledButtonGroup>
            <Text css={{ display: `flex`, flexWrap: `wrap` }}>
              {mappedText()}
            </Text>
          </Container>
        </>
      )}
    </>
  );
};

const HoverableWord = styled.span`
  padding: 1px;
  box-sizing: border-box;
  :hover {
    background-color: #8686ff;
    cursor: pointer;
    border-radius: 3px;
  }
`;
