import styled from "@emotion/styled";
import { Button, ButtonGroup, Spacer, Textarea } from "@nextui-org/react";
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
        <div className="container mx-auto">
          <h3>Edit your text</h3>
          <ButtonGroup>
            <Button onPress={saveText} size={"sm"}>
              Save
            </Button>
          </ButtonGroup>
          <Spacer y={1} />
          <Textarea
            value={currentTextContent}
            onValueChange={setCurrentTextContent}
            maxRows={50}
          ></Textarea>
        </div>
      ) : (
        <>
          <div className="container mx-auto">
            <ButtonGroup>
              <Button
                onPress={() => setIsInEditMode(!isInEditMode)}
                size={"sm"}
              >
                Edit
              </Button>
            </ButtonGroup>
            <p className="flex flex-wrap">{mappedText()}</p>
          </div>
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
