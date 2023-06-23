"use client";
import {
  Input,
  Dropdown,
  Button,
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
import { ArrowUpRight, ChevronDown } from "react-feather";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import NextLink from "next/link";

export default function TextPage({ params }: { params: { id: string } }) {
  const supabaseClient = createClientComponentClient();

  const [text, setText] = useState<TextRow | null>(null);
  const [flashcardLists, setFlashcardLists] = useState<
    FlashcardListWithNameOnly[] | null
  >(null);

  const [textEpubUrl, setTextEpubUrl] = useState<string | null | undefined>(
    undefined
  );

  useEffect(() => {
    const textId = params.id;
    getTextById(supabaseClient, textId).then((newText) => {
      setText(newText);
      setTextEpubUrl(newText && newText.epub_file);
    });
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
    <div className="grid grid-cols-2 md:grid-cols-3  w-screen gap-2 p-4 h-[calc(100vh-6.1rem)]">
      <div className="col-span-2">
        {!!textEpubUrl ? (
          <>
            <div className="container mx-auto w-full h-full">
              <h1 className="text-lg font-bold mb-4">{text && text.name}</h1>
              {textEpubUrl && (
                <ReactReaderWrapper
                  url={textEpubUrl}
                  lastLocation={text && text.last_epub_location}
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
      <div className="hidden md:flex flex-col w-60 gap-y-4">
        <h3>Translation</h3>
        <div className="flex flex-col gap-y-4 ">
          <div className="flex flex-row justify-between">
            <h6>From:</h6>
            {/* <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered" color="secondary">
                  {selectedSourceLanguage
                    ? selectedSourceLanguage.nativeName
                    : "Detect Language"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Select source language"
                onAction={(key) => handleSelectSourceLanguage(key.toString())}
                selectionMode="single"
              >
                {supportedLanguages.map((language) => (
                  <DropdownItem key={language.key}>
                    {language.nativeName}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown> */}
          </div>
          <div className="flex flex-row w-60 justify-between">
            <h6>To:</h6>
            {/* <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered" color="secondary">
                  {selectedTargetLanguage
                    ? selectedTargetLanguage.nativeName
                    : "Not selected"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Select target language"
                onAction={(key) => handleSelectTargetLanguage(key.toString())}
                selectionMode="single"
              >
                {supportedLanguages.map((language) => (
                  <DropdownItem key={language.key}>
                    {language.nativeName}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown> */}
          </div>
        </div>
        {flashcardLists && (
          <div className="flex flex-row w-60 justify-between">
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered" endContent={<ChevronDown />}>
                  {flashcardLists.find(
                    (flashcardList) => flashcardList.id === selectedList
                  )?.name || "Select list"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Select flashcard list"
                onAction={() => console.log("action")}
                selectionMode="single"
              >
                {flashcardLists.map((flashcardList, index) => (
                  <DropdownItem
                    description={flashcardList.name}
                    key={flashcardList.name}
                  >
                    {flashcardList.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {selectedList && (
              <Button
                color="secondary"
                as={NextLink}
                href={getRouteForFlashcardList(selectedList)}
                isIconOnly
              >
                <ArrowUpRight />
              </Button>
            )}
          </div>
        )}
        <div className="flex gap-y-8 w-60">
          <form action="" className="flex flex-col gap-y-4">
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

const FlexRowDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;
