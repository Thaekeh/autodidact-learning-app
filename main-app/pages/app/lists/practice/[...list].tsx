import styled from "@emotion/styled";
import { Button, Container, Spacer, Text, theme } from "@nextui-org/react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Flashcard from "components/cards/Flashcard";
import { NextApiRequest, NextApiResponse } from "next";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { useRouter } from "next/router";
import { useState } from "react";
import { ArrowLeft } from "react-feather";
import { Database, FlashcardRow } from "types";
import {
  getFlashcardsThatRequirePracticeByListId,
  getRouteForFlashcardList,
  updateFlashcardWithSpacedRepetitionData,
} from "utils";
import { calculateNewCardRepetitionData } from "utils/mapping/flashcards";

export default function ListPage({
  listId,
  flashcards,
}: {
  listId: string;
  flashcards: FlashcardRow[] | null;
}) {
  const [flashcardIndex, setFlashcardIndex] = useState<number>(0);
  const router = useRouter();

  const supabase = useSupabaseClient();

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
      <Container display="flex" justify="center">
        <Spacer y={3}></Spacer>
        <BackButtonContainer>
          <Button
            onClick={() => router.push(getRouteForFlashcardList(listId))}
            light
            icon={<ArrowLeft />}
            flat
            color={"secondary"}
          >
            Back
          </Button>
        </BackButtonContainer>
        <Spacer y={6}></Spacer>

        <Container
          display="flex"
          direction="column"
          justify="center"
          alignItems="center"
        >
          {hasSelectedFlashcard ? (
            <Flashcard
              text={{
                front: selectedFlashcard?.frontText || "",
                back: selectedFlashcard?.backText || "",
              }}
            />
          ) : (
            <StyledDiv>
              <Text>No more cards to practice</Text>
            </StyledDiv>
          )}

          <Spacer y={4} />
          <Container display="flex" justify="center">
            <Button
              disabled={!hasSelectedFlashcard}
              bordered
              onClick={() => handleDifficultyButtonClick("difficult")}
            >
              Difficult
            </Button>
            <Spacer x={1}></Spacer>
            <Button
              disabled={!hasSelectedFlashcard}
              bordered
              onClick={() => handleDifficultyButtonClick("okay")}
            >
              Okay
            </Button>
            <Spacer x={1}></Spacer>
            <Button
              bordered
              disabled={!hasSelectedFlashcard}
              onClick={() => handleDifficultyButtonClick("easy")}
            >
              Easy
            </Button>
          </Container>
        </Container>
      </Container>
    </>
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

  const listId = params.list[0];

  const flashcardsThatRequirePractice = await (
    await getFlashcardsThatRequirePracticeByListId(supabase, listId)
  ).data;
  return {
    props: {
      listId: listId,
      flashcards: flashcardsThatRequirePractice,
    },
  };
}

const StyledDiv = styled.div`
  max-width: 10rem;
  height: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BackButtonContainer = styled.div`
  width: 100%;
  justify-content: flex-start;
`;
