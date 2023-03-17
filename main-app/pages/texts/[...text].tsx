import {
	Container,
	Grid,
	Textarea,
	Text,
	Input,
	Dropdown,
} from "@nextui-org/react";
import React, { useState } from "react";
import styled from "@emotion/styled";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../types/supabase";
import { NextApiRequest, NextApiResponse } from "next";
import { TextRow } from "../../types/Texts";
import {
	FlashcardListWithNameOnly,
	getAllFlashcardListsNamesOnly,
} from "../../util";

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

	const handleTextClick = (event: React.MouseEvent<HTMLSpanElement>) => {
		console.log(event?.currentTarget.innerHTML);
	};

	const mappedText = () => {
		if (!text?.content) return "Empty";
		const textInArray = text.content.split(" ");
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

	const setText = (inputText: string) => {};

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
				{isInEditMode ? (
					<>
						<Text h4>Edit your text</Text>
						<Textarea
							animated={false}
							value={text?.content || ""}
							onChange={(event) => setText(event.target.value)}
							maxRows={50}
						></Textarea>
					</>
				) : (
					<>
						<Container wrap="wrap" css={{ maxWidth: `100%` }}>
							<Text h2>{text?.name}</Text>
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
							<Dropdown.Button>
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
				<div>
					<form action="">
						<Input
							label="Front of card"
							name="front"
							required={true}
							value={frontOfCardValue || ""}
							onChange={(e) => setFrontOfCardValue(e.target.value)}
						></Input>
						<Input
							label="Back of card"
							name="back"
							required={true}
							value={backOfCardValue || ""}
							onChange={(e) => setBackOfCardValue(e.target.value)}
						></Input>
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
