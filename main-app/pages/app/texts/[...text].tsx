import {
  Container,
  Grid,
  Text,
  Input,
  Dropdown,
  Button,
  Spacer,
  Loading,
} from "@nextui-org/react";
import React, { useState } from "react";
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
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { getTextById, saveTextContent } from "utils/supabase/texts";
import { ReactReaderWrapper } from "components/reader/reactReader/ReactReaderWrapper";
import { TextReader } from "components/reader/TextReader";
import styled from "@emotion/styled";
import {
  SupportedLanguage,
  getSupportedLanguages,
} from "utils/translation/getSupportedLanguages";

export default function TextPage({
  text,
  flashcardLists,
}: {
  text: TextRow | null;
  flashcardLists: FlashcardListWithNameOnly[] | null;
}) {
  const [frontOfCardValue, setFrontOfCardValue] = useState("");
  const [backOfCardValue, setBackOfCardValue] = useState("");
  const [selectedList, setSelectedList] = useState(
    flashcardLists ? flashcardLists[0].id : undefined
  );

  const supabase = useSupabaseClient();

  const [textEpubUrl] = useState<string | null | undefined>(text?.epub_file);

  const [textContent] = useState(text?.content || "");

  const [savingCardIsLoading, setSavingCardIsLoading] = useState(false);

  const translateText = async (text: string) => {
    if (!selectedTargetLanguage) return;
    const { translatedWord } = await fetch("/api/translate", {
      method: "POST",
      body: JSON.stringify({
        word: text,
        sourceLanguage: selectedSourceLanguage
          ? selectedSourceLanguage.key
          : undefined,
        targetLanguage: selectedTargetLanguage.key,
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

  const handleSaveText = (newTextContent: string) => {
    if (!text || !newTextContent) return;
    saveTextContent(supabase, text.id, newTextContent);
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

    cleanUpAndCallTranslateText(frontOfCardValue);
  };

  const [supportedLanguages] = useState<SupportedLanguage[]>(
    getSupportedLanguages()
  );

  const [selectedSourceLanguage, setSelectedSourceLanguage] = useState<
    SupportedLanguage | undefined
  >();

  const [selectedTargetLanguage, setSelectedTargetLanguage] = useState<
    SupportedLanguage | undefined
  >(supportedLanguages.find((language) => language.key === "es"));

  const cleanUpAndCallTranslateText = async (text: string) => {
    const cleanedText = text.replace(/['"]+/g, "");
    const translatedText = await translateText(cleanedText);
    const cleanedTranslatedText = translatedText
      .replace(/['"]+/g, "")
      .toLowerCase();
    setBackOfCardValue(cleanedTranslatedText);
  };

  const handleSelectTargetLanguage = (key: string) => {
    if (key === selectedTargetLanguage?.key) return;
    setSelectedTargetLanguage(
      supportedLanguages.find((language) => language.key === key)
    );
    cleanUpAndCallTranslateText(frontOfCardValue);
  };

  const handleSelectSourceLanguage = (key: string) => {
    if (key === selectedSourceLanguage?.key) return;
    setSelectedSourceLanguage(
      supportedLanguages.find((language) => language.key === key)
    );
    cleanUpAndCallTranslateText(frontOfCardValue);
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
        {!!text?.epub_file ? (
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
          <TextReader
            handleSaveText={handleSaveText}
            handleTextClick={handleTextClick}
            textContent={textContent}
          />
        )}
      </Grid>
      <Grid xs={3} direction="column">
        <Text h3>Translation</Text>
        <FlexContainer>
          <div>
            <Text h6>From</Text>
            <Dropdown>
              <Dropdown.Button size={"xs"} flat>
                {selectedSourceLanguage
                  ? selectedSourceLanguage.name
                  : "Detect Language"}
              </Dropdown.Button>
              <Dropdown.Menu
                onAction={(key) => handleSelectSourceLanguage(key.toString())}
                selectionMode="single"
              >
                {supportedLanguages.map((language) => (
                  <Dropdown.Item key={language.key}>
                    {language.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div>
            <Text h6>To</Text>
            <Dropdown>
              <Dropdown.Button size={"xs"} flat>
                {selectedTargetLanguage
                  ? selectedTargetLanguage.name
                  : "Not selected"}
              </Dropdown.Button>
              <Dropdown.Menu
                onAction={(key) => handleSelectTargetLanguage(key.toString())}
                selectionMode="single"
              >
                {supportedLanguages.map((language) => (
                  <Dropdown.Item key={language.key}>
                    {language.nativeName}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </FlexContainer>
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
  const text = await getTextById(supabase, textId);

  const flashcardLists = await getAllFlashcardListsNamesOnly(supabase);

  return { props: { text: text, flashcardLists } };
}

const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-bottom: 20px;
`;
