import {
  Container,
  Grid,
  Text,
  Input,
  Dropdown,
  Button,
  Spacer,
  Loading,
  StyledButtonGroup,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "types/supabase";
import { NextApiRequest, NextApiResponse } from "next";
import { TextRow } from "types/Texts";
import {
  createNewFlashcard,
  FlashcardListWithNameOnly,
  getAllFlashcardListsNamesOnly,
} from "utils";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { saveTextContent } from "utils/supabase/texts";
import { ReactReaderWrapper } from "components/reactReader/ReactReaderWrapper";

export default function TextPage({
  text,
  flashcardLists,
}: {
  text: TextRow | null;
  flashcardLists: FlashcardListWithNameOnly[] | null;
}) {
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [frontOfCardValue, setFrontOfCardValue] = useState("");
  const [backOfCardValue, setBackOfCardValue] = useState("");
  const [selectedList, setSelectedList] = useState(
    flashcardLists ? flashcardLists[0].id : undefined
  );

  const supabase = useSupabaseClient();

  const user = useUser();

  const [textEpubUrl, setTextEpubUrl] = useState<string | undefined>();

  useEffect(() => {
    if (!user) return;
    // const getEpubFileForText = async () => {
    //   if (!text?.epub_file) return;
    //   const { data } = await supabase.storage
    //     .from("text-files")
    //     .createSignedUrl(`${user.id}/${text.epub_file}`, 60);
    //   setTextEpubUrl(epub(data?.signedUrl);
    // };
    setTextEpubUrl("test");
    if (!text) return;
    // getEpubFileForText();
  }, [text]);

  const [textContent] = useState(text?.content || "");

  const [savingCardIsLoading, setSavingCardIsLoading] = useState(false);

  const translateText = async (text: string) => {
    const { translatedWord } = await fetch("/api/translate", {
      method: "POST",
      body: JSON.stringify({
        word: text,
        sourceLanguage: "en",
        targetLanguage: "es",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
    if (translatedWord) {
      return translatedWord;
    }
  };

  const handleTextClick = async (event: React.MouseEvent<HTMLSpanElement>) => {
    const word = event?.currentTarget.innerHTML.toLowerCase();
    if (word.length) {
      setFrontOfCardValue(word);
    }
    const { translatedWord } = await fetch("/api/translate", {
      method: "POST",
      body: JSON.stringify({
        word,
        sourceLanguage: "en",
        targetLanguage: "es",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
    if (translatedWord) {
      setBackOfCardValue(translatedWord.replace(/['"]+/g, ""));
    }
  };

  const mappedText = () => {
    if (!textContent) return "Empty";
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

  const handleSaveText = () => {
    if (!text || !textContent) return;
    setIsInEditMode(false);
    saveTextContent(supabase, text.id, textContent);
  };

  const handleSaveCard = async () => {
    if (!selectedList || !frontOfCardValue.length || !backOfCardValue.length) {
      return;
    }
    setSavingCardIsLoading(true);
    await createNewFlashcard(
      supabase,
      frontOfCardValue,
      backOfCardValue,
      selectedList
    );
    setSavingCardIsLoading(false);
  };

  const processTextSelection = async (selectedText: string) => {
    const trimmedText = selectedText.trim();
    if (!trimmedText.length) return;
    setFrontOfCardValue(trimmedText.toLowerCase());
    const translatedText = await translateText(trimmedText);
    const cleanedTranslatedText = translatedText
      .replace(/['"]+/g, "")
      .toLowerCase();
    setBackOfCardValue(cleanedTranslatedText);
  };

  return (
    <Grid.Container
      gap={2}
      justify="center"
      css={{ marginTop: `2rem`, width: `100vw`, margin: 0 }}
    >
      <Grid
        xs={6}
        css={{
          maxHeight: `80vh`,
          height: `80vh`,
        }}
      >
        {!isInEditMode ? (
          <>
            <Container direction="column" wrap="wrap">
              <Text h3>Epub test</Text>
              {textEpubUrl && (
                <ReactReaderWrapper
                  url={textEpubUrl}
                  processTextSelection={processTextSelection}
                />
              )}
            </Container>
          </>
        ) : (
          // <>
          //   <Container direction="column" wrap="wrap">
          //     <Text h3>Edit your text</Text>
          //     <StyledButtonGroup>
          //       <Button onPress={handleSaveText} size={"sm"}>
          //         Save
          //       </Button>
          //     </StyledButtonGroup>
          //     <Spacer y={1} />
          //     <Textarea
          //       animated={false}
          //       value={textContent}
          //       onChange={(event) => setTextContent(event.target.value)}
          //       maxRows={50}
          //     ></Textarea>
          //   </Container>
          // </>
          <>
            <Container wrap="wrap" css={{ maxWidth: `100%` }}>
              <Text h3>{text?.name}</Text>
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
      </Grid>
      <Grid xs={3} direction="column">
        <Text h3>Add card to list</Text>
        {flashcardLists && (
          <div>
            <Dropdown>
              <Dropdown.Button flat>
                {
                  flashcardLists.find(
                    (flashcardList) => flashcardList.id === selectedList
                  )?.name
                }
              </Dropdown.Button>
              <Dropdown.Menu
                onAction={(key) => setSelectedList(key.toString())}
                selectionMode="single"
              >
                {flashcardLists.map((flashcardList) => (
                  <Dropdown.Item key={flashcardList.id}>
                    {flashcardList.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        )}
        <div style={{ maxWidth: "300px" }}>
          <form action="">
            <Input
              label="Front of card"
              name="front"
              required={true}
              value={frontOfCardValue || ""}
              onChange={(e) => setFrontOfCardValue(e.target.value)}
              fullWidth
            ></Input>
            <Input
              label="Back of card"
              name="back"
              required={true}
              value={backOfCardValue || ""}
              onChange={(e) => setBackOfCardValue(e.target.value)}
              fullWidth
            ></Input>
            <Spacer y={1} />
            <Button
              disabled={savingCardIsLoading}
              color={"secondary"}
              flat
              onPress={handleSaveCard}
            >
              {savingCardIsLoading ? (
                <Loading color={"secondary"} type="points-opacity" />
              ) : (
                "Save Card"
              )}
            </Button>
          </form>
        </div>
      </Grid>
    </Grid.Container>
  );
}

export async function getServerSideProps({
  req,
  res,
  params,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
  params: Params;
}) {
  const supabase = await createServerSupabaseClient<Database>({
    req,
    res,
  });

  const textId = params.text[0];
  const { data: text } = await supabase
    .from("texts")
    .select()
    .eq("id", textId)
    .single();

  const flashcardLists = await getAllFlashcardListsNamesOnly(supabase);

  return { props: { text: text, flashcardLists } };
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
