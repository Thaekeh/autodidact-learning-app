import styled from "@emotion/styled";
import {
	Card,
	Container,
	Input,
	theme,
	useInput,
	styled as NextUIStyled,
} from "@nextui-org/react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { NextApiRequest, NextApiResponse } from "next";
import React from "react";
import { Database, ProfileRow } from "../types";

type FieldName = "name";

export async function getServerSideProps({
	req,
	res,
}: {
	req: NextApiRequest;
	res: NextApiResponse;
}) {
	const supabase = await createServerSupabaseClient<Database>({ req, res });
	const { data: profile } = await supabase.from("profiles").select().single();
	return { props: { profile } };
}

export default function Profile({ profile }: { profile: ProfileRow }) {
	const user = useUser();
	const supabase = useSupabaseClient();
	const { value: nameInputValue, bindings: nameInputBindings } = useInput(
		profile.name || ""
	);

	const onInputFieldBlur = async (fieldName: FieldName, fieldValue: string) => {
		const updateDocument: Partial<ProfileRow> = {};
		updateDocument[fieldName] = fieldValue;
		await supabase
			.from("profiles")
			.update(updateDocument)
			.eq("user_id", user?.id);
	};

	return (
		<Container xs>
			<BackgroundDiv>
				<HeadingContainer>
					<PaddedCard variant="bordered">
						<h3>Settings</h3>
						<Input
							shadow={false}
							label="Name"
							value={nameInputValue}
							onChange={nameInputBindings.onChange}
							onBlur={() => onInputFieldBlur("name", nameInputValue)}
						></Input>
					</PaddedCard>
				</HeadingContainer>
			</BackgroundDiv>
		</Container>
	);
}

const BackgroundDiv = styled.div`
	background-color: ${theme.colors.white.value};
	height: 100%;
	width: 100%;
	margin-top: ${theme.space[12].value};
`;

const HeadingContainer = styled.div`
	display: flex;
	justify-content: center;
	flex-direction: column;
`;

const PaddedCard = NextUIStyled(Card, {
	padding: theme.space[12].value,
});
