"use client";
import {
  Input,
  Dropdown,
  Button,
  Spacer,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { TextRow } from "types/Texts";
import {
  createNewFlashcard,
  FlashcardListWithNameOnly,
  getAllFlashcardListsNamesOnly,
  getRouteForFlashcardList,
} from "utils";
import {
  getTextById,
  setLastEpubLocation,
  setLastFlashcardList,
  setLastSourceLanguage,
  setLastTargetLanguage,
  setTextContent,
} from "utils/supabase/texts";
import { ReactReaderWrapper } from "components/reader/reactReader/ReactReaderWrapper";
import { TextReader } from "components/reader/TextReader";
import styled from "@emotion/styled";
import {
  SupportedLanguage,
  getSupportedLanguages,
} from "utils/translation/getSupportedLanguages";
// import { IconButton } from "components/buttons/IconButton";
import { ArrowUpRight } from "react-feather";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function TextPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const supabaseClient = createClientComponentClient();

  const [text, setText] = useState<TextRow | null>(null);
  const [flashcardLists, setFlashcardLists] = useState<
    FlashcardListWithNameOnly[] | null
  >(null);

  useEffect(() => {
    const textId = params.id;
    getTextById(supabaseClient, textId).then((newText) => setText(newText));
    getAllFlashcardListsNamesOnly(supabaseClient).then((lists) =>
      setFlashcardLists(lists)
    );
  }, [params, supabaseClient]);

  const [frontOfCardValue, setFrontOfCardValue] = useState("");
  const [backOfCardValue, setBackOfCardValue] = useState("");

  const [selectedList, setSelectedList] = useState<string | undefined>("");

  useEffect(() => {
    if (!flashcardLists) return;
    const defaultFlashcardList = flashcardLists.find(
      (flashcardList) => text?.last_flashcard_list === flashcardList.id
    );
    setSelectedList(defaultFlashcardList?.id || flashcardLists[0].id);
  }, [flashcardLists]);

  const handleSetSelectedList = (listId: string) => {
    if (!text?.id) return;
    setSelectedList(listId);
    setLastFlashcardList(supabaseClient, text.id, listId);
  };

  const [waitingForTranslation, setWaitingForTranslation] = useState(false);

  const [textEpubUrl] = useState<string | null | undefined>(text?.epub_file);

  const [textContent] = useState(text?.content || "");

  const [savingCardIsLoading, setSavingCardIsLoading] = useState(false);

  const translateText = async (
    text: string,
    sourceLanguageKey: string | undefined,
    targetLanguageKey: string | undefined
  ) => {
    setWaitingForTranslation(true);

    const { translation } = await fetch("/api/translate", {
      method: "POST",
      body: JSON.stringify({
        word: text,
        sourceLanguage: sourceLanguageKey,
        targetLanguage: targetLanguageKey,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
    setWaitingForTranslation(false);
    if (translation) {
      const cleanedTranslation = translation
        .replace(/['"]+/g, "")
        .toLowerCase();

      setBackOfCardValue(cleanedTranslation);
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
    setTextContent(supabaseClient, text.id, newTextContent);
  };

  const handleSaveCard = async () => {
    if (!selectedList || !frontOfCardValue.length || !backOfCardValue.length) {
      return;
    }
    setSavingCardIsLoading(true);
    await createNewFlashcard(
      supabaseClient,
      frontOfCardValue,
      backOfCardValue,
      selectedList
    );
    setSavingCardIsLoading(false);
  };

  const processTextSelection = async (selectedText: string) => {
    const trimmedText = selectedText.trim().toLowerCase();
    if (!trimmedText.length) return;
    setFrontOfCardValue(trimmedText);

    translateText(
      trimmedText,
      selectedSourceLanguage?.key,
      selectedTargetLanguage?.key
    );
  };

  const [supportedLanguages] = useState<SupportedLanguage[]>(
    getSupportedLanguages()
  );

  const getSupportedLanguageByKey = (key: string) => {
    return supportedLanguages.find((language) => language.key === key);
  };

  const [selectedSourceLanguage, setSelectedSourceLanguage] = useState<
    SupportedLanguage | undefined
  >(
    text?.last_source_language
      ? getSupportedLanguageByKey(text?.last_source_language)
      : undefined
  );

  const [selectedTargetLanguage, setSelectedTargetLanguage] = useState<
    SupportedLanguage | undefined
  >(getSupportedLanguageByKey(text?.last_target_language || "en"));

  const handleSelectTargetLanguage = async (key: string) => {
    if (key === selectedTargetLanguage?.key) return;
    setSelectedTargetLanguage(
      supportedLanguages.find((language) => language.key === key)
    );
    if (!text?.id) return;
    setLastTargetLanguage(supabaseClient, text?.id, key);
    if (!frontOfCardValue.length) return;
    translateText(frontOfCardValue, selectedSourceLanguage?.key, key);
  };

  const handleSelectSourceLanguage = (key: string) => {
    if (key === selectedSourceLanguage?.key) return;
    setSelectedSourceLanguage(
      supportedLanguages.find((language) => language.key === key)
    );
    if (!text?.id) return;
    setLastSourceLanguage(supabaseClient, text.id, key);
    if (!frontOfCardValue.length) return;

    translateText(frontOfCardValue, key, selectedTargetLanguage?.key);
  };

  const setLastLocation = async (location: string) => {
    if (!text?.id) return;
    setLastEpubLocation(supabaseClient, text.id, location);
  };

  return (
    <div className="grid grid-cols-3 w-screen gap-2 p-6">
      <div className="col-span-2">
        {!!text?.epub_file ? (
          <>
            <div className="container mx-auto">
              <h3>{text.name}</h3>
              {textEpubUrl && (
                <ReactReaderWrapper
                  url={textEpubUrl}
                  lastLocation={text.last_epub_location}
                  setLastLocation={setLastLocation}
                  processTextSelection={processTextSelection}
                />
              )}
            </div>
          </>
        ) : (
          <TextReader
            handleSaveText={handleSaveText}
            handleTextClick={handleTextClick}
            textContent={textContent}
          />
        )}
      </div>
      <div
        className="flex "
        // xs={3} direction="column"
      >
        <h3>Translation</h3>
        <FlexContainer>
          <div>
            <h6>From</h6>
            <Dropdown>
              <DropdownTrigger>
                {selectedSourceLanguage
                  ? selectedSourceLanguage.nativeName
                  : "Detect Language"}
              </DropdownTrigger>
              <DropdownMenu
                onAction={(key) => handleSelectSourceLanguage(key.toString())}
                selectionMode="single"
              >
                {supportedLanguages.map((language) => (
                  <DropdownItem key={language.key}>
                    {language.nativeName}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
          <div>
            <h6>To</h6>
            <Dropdown>
              <DropdownTrigger>
                {selectedTargetLanguage
                  ? selectedTargetLanguage.nativeName
                  : "Not selected"}
              </DropdownTrigger>
              <DropdownMenu
                onAction={(key) => handleSelectTargetLanguage(key.toString())}
                selectionMode="single"
              >
                {supportedLanguages.map((language) => (
                  <DropdownItem key={language.key}>
                    {language.nativeName}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </FlexContainer>
        {flashcardLists && (
          <FlexRowDiv>
            <Dropdown>
              <DropdownTrigger>
                {flashcardLists.find(
                  (flashcardList) => flashcardList.id === selectedList
                )?.name || "Select list"}
              </DropdownTrigger>
              <DropdownMenu
                onAction={(key) => handleSetSelectedList(key.toString())}
                selectionMode="single"
              >
                {flashcardLists.map((flashcardList) => (
                  <DropdownItem key={flashcardList.id}>
                    {flashcardList.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {selectedList && (
              <Button
                color="secondary"
                onPress={() =>
                  router.push(getRouteForFlashcardList(selectedList))
                }
                isIconOnly
              >
                <ArrowUpRight />
              </Button>
            )}
          </FlexRowDiv>
        )}
        <div style={{ maxWidth: "300px" }}>
          <form action="">
            <Input
              label="Front of card"
              name="front"
              required={true}
              value={frontOfCardValue}
              onValueChange={setFrontOfCardValue}
              fullWidth
            ></Input>
            <Input
              label="Back of card"
              name="back"
              required={true}
              value={backOfCardValue}
              onValueChange={setBackOfCardValue}
              fullWidth
            ></Input>
            <Spacer y={1} />
            <Button
              disabled={savingCardIsLoading}
              color={"secondary"}
              variant="flat"
              onPress={handleSaveCard}
              isLoading={savingCardIsLoading}
            >
              Save Card
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

// export async function getServerSideProps({
//   req,
//   res,
//   params,
// }: {
//   req: NextApiRequest;
//   res: NextApiResponse;
//   params: Params;
// }) {
//   const supabase = await createServerSupabaseClient<Database>({
//     req,
//     res,
//   });

//   const textId = params.text[0];
//   const text = await getTextById(supabase, textId);

//   const flashcardLists = await getAllFlashcardListsNamesOnly(supabase);

//   return { props: { text: text, flashcardLists } };
// }

const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-bottom: 20px;
`;

const FlexRowDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;
