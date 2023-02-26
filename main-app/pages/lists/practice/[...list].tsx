import { Button, Container, Spacer, Text } from "@nextui-org/react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { NextApiRequest, NextApiResponse } from "next";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { useState } from "react";
import { Database, FlashcardRow } from "../../../types";
import {
	getFlashcardsThatRequirePracticeByListId,
	updateFlashcardWithSpacedRepetitionData,
} from "../../../util";
import { calculateNewCardRepetitionData } from "../../../util/mapping/flashcards";

export default function ListPage({
	flashcards,
}: {
	flashcards: FlashcardRow[] | null;
}) {
	const [flashcardIndex, setFlashcardIndex] = useState<number>(0);
	const [showBack, setShowBack] = useState<boolean>(false);

	const supabase = useSupabaseClient();

	const handleDifficultyButtonClick = (
		difficultyResponse: "difficult" | "okay" | "easy"
	) => {
		if (!flashcards) return;
		const selectedFlashcard = flashcards[flashcardIndex];
		const next_practice_date = Date.now();
		const newCardData = calculateNewCardRepetitionData({
			repetitions: selectedFlashcard.repetitions,
			difficultyResponse,
			easeFactor: selectedFlashcard.ease_factor,
			interval: selectedFlashcard.interval,
		});

		const response = updateFlashcardWithSpacedRepetitionData(supabase, {
			ease_factor: newCardData.easeFactor,
			id: selectedFlashcard.id,
			interval: newCardData.interval,
			repetitions: newCardData.repetitions,
		});
	};

	return (
		<>
			<Container display="flex" justify="center">
				<Spacer y={2}></Spacer>
				<Container
					display="flex"
					direction="row"
					justify="space-between"
					alignContent="center"
				></Container>
				<Container display="flex" justify="center">
					{/* TODO add nice flashcard here */}
					{flashcards && (
						<div onClick={() => setShowBack(!showBack)}>
							{!showBack
								? flashcards[flashcardIndex].frontText
								: flashcards[flashcardIndex].backText}
						</div>
					)}
					<Spacer y={4} />
					<Container display="flex" justify="center">
						<Button
							bordered
							onClick={() => handleDifficultyButtonClick("difficult")}
						>
							Difficult
						</Button>
						<Spacer x={1}></Spacer>
						<Button
							bordered
							onClick={() => handleDifficultyButtonClick("okay")}
						>
							Okay
						</Button>
						<Spacer x={1}></Spacer>
						<Button
							bordered
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
	// const list = await getListById(supabase, listId);

	const flashcardsThatRequirePractice = await (
		await getFlashcardsThatRequirePracticeByListId(supabase, listId)
	).data;
	return {
		props: {
			flashcards: flashcardsThatRequirePractice,
		},
	};
}
