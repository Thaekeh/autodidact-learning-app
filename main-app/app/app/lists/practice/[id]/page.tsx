"use client";
import { Button, Spacer } from "@nextui-org/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Flashcard from "components/cards/Flashcard";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "react-feather";
import { FlashcardRow } from "types";
import {
  getFlashcardsThatRequirePracticeByListId,
  getRouteForFlashcardList,
  updateFlashcardWithSpacedRepetitionData,
} from "utils";
import { calculateNewCardRepetitionData } from "utils/mapping/flashcards";

export default function PracticePage({ params }: { params: { id: string } }) {
  const [flashcardIndex, setFlashcardIndex] = useState<number>(0);
  const [flashcards, setFlashcards] = useState<FlashcardRow[] | null>(null);

  const supabase = createClientComponentClient();

  useEffect(() => {
    getFlashcardsThatRequirePracticeByListId(supabase, params.id).then(
      (flashcards) => {
        setFlashcards(flashcards);
      }
    );
  }, []);

  const handleDifficultyButtonClick = (
    difficultyResponse: "difficult" | "okay" | "easy"
  ) => {
    if (!flashcards) return;
    const selectedFlashcard = flashcards[flashcardIndex];
    const newCardData = calculateNewCardRepetitionData({
      repetitions: selectedFlashcard.repetitions,
      difficultyResponse,
      easeFactor: selectedFlashcard.ease_factor,
      interval: selectedFlashcard.interval,
    });

    updateFlashcardWithSpacedRepetitionData(supabase, {
      ease_factor: newCardData.easeFactor,
      id: selectedFlashcard.id,
      interval: newCardData.interval,
      repetitions: newCardData.repetitions,
    });
    setFlashcardIndex(flashcardIndex + 1);
  };

  const hasSelectedFlashcard = !!(flashcards && flashcards[flashcardIndex]);

  const selectedFlashcard = flashcards && flashcards[flashcardIndex];

  return (
    <>
      <div className="flex flex-col m-auto max-w-screen-lg h-[calc(100vh-4.1rem)] ">
        <div>
          <Spacer y={3}></Spacer>
          <div>
            <Button
              as={NextLink}
              href={getRouteForFlashcardList(params.id)}
              startIcon={<ArrowLeft />}
              variant="light"
              color={"secondary"}
            >
              Back
            </Button>
          </div>
        </div>
        <Spacer y={6}></Spacer>

        <div className="flex flex-col w-full h-full justify-center items-center">
          {hasSelectedFlashcard ? (
            <Flashcard
              text={{
                front: selectedFlashcard?.frontText || "",
                back: selectedFlashcard?.backText || "",
              }}
            />
          ) : (
            <div>
              <p>No more cards to practice</p>
            </div>
          )}

          <Spacer y={4} />
          <div className="flex justify-center">
            <Button
              disabled={!hasSelectedFlashcard}
              variant="bordered"
              onClick={() => handleDifficultyButtonClick("difficult")}
            >
              Difficult
            </Button>
            <Spacer x={1}></Spacer>
            <Button
              disabled={!hasSelectedFlashcard}
              variant="bordered"
              onClick={() => handleDifficultyButtonClick("okay")}
            >
              Okay
            </Button>
            <Spacer x={1}></Spacer>
            <Button
              variant="bordered"
              disabled={!hasSelectedFlashcard}
              onClick={() => handleDifficultyButtonClick("easy")}
            >
              Easy
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
