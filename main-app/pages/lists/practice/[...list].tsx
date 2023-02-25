import { Button, Container, Spacer, Text } from "@nextui-org/react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { NextApiRequest, NextApiResponse } from "next";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { useState } from "react";
import { Database, FlashcardRow } from "../../../types";
import { getFlashcardsThatRequirePracticeByListId } from "../../../util";

export default function ListPage({
	flashcards,
}: {
	flashcards: FlashcardRow[] | null;
}) {
	const [flashcardIndex, setFlashcardIndex] = useState<number>(0);
	const [showBack, setShowBack] = useState<boolean>(false);

	const supabase = useSupabaseClient();

	return (
		<>
			<Container>
				<Spacer y={2}></Spacer>
				<Container
					display="flex"
					direction="row"
					justify="space-between"
					alignContent="center"
				>
					{/* <Text h3>{list?.name}</Text>
					<Text>{flashcardsToPracticeCount} card(s) to practice</Text>
					<Button
						disabled={!!flashcardsToPracticeCount}
						size={"md"}
						icon={<Play size={16} />}
					>
						Practice
					</Button> */}
				</Container>
				<Container>
					{/* TODO add nice flashcard here */}
					{flashcards && (
						<div onClick={() => setShowBack(!showBack)}>
							{!showBack
								? flashcards[flashcardIndex].frontText
								: flashcards[flashcardIndex].backText}
						</div>
					)}
					{/* TODO handle out of range error, add button for response quality */}
					<Button onClick={() => setFlashcardIndex(flashcardIndex + 1)}>
						Next
					</Button>
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
