import {
	Button,
	Container,
	Spacer,
	useModal,
	Text,
	Table,
} from "@nextui-org/react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import React from "react";
import { Edit2, Plus } from "react-feather";
import { IconButton } from "../../components/buttons/IconButton";
import { NameModal } from "../../components/modals/NameModal";
import { Database, FlashcardListRow } from "../../types";
import { getListsForUser } from "../../util";

export default function Lists({ lists }: { lists: FlashcardListRow[] | null }) {
	const { visible, setVisible: setNewListModalIsVisible } = useModal(false);

	const editListButtonHandler = (list: FlashcardListRow) => {};

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
					<Text h3>Your lists</Text>
					<Button size={"md"} icon={<Plus size={16} />}>
						Create New
					</Button>
				</Container>
				<Table>
					<Table.Header>
						<Table.Column>Name</Table.Column>
						<Table.Column>Last opened</Table.Column>
						<Table.Column>
							<IconButton onClick={() => setNewListModalIsVisible(true)}>
								<Plus />
							</IconButton>
						</Table.Column>
					</Table.Header>
					<Table.Body>
						{lists ? (
							lists?.map((list) => {
								return (
									<Table.Row key={list.id}>
										<Table.Cell>{list.name}</Table.Cell>
										<Table.Cell> </Table.Cell>
										<Table.Cell>
											<IconButton onClick={() => editListButtonHandler(list)}>
												<Edit2 />
											</IconButton>
										</Table.Cell>
									</Table.Row>
								);
							})
						) : (
							<Table.Row>
								<Table.Cell>No cards in this list found</Table.Cell>
								<Table.Cell> </Table.Cell>
								<Table.Cell> </Table.Cell>
								<Table.Cell> </Table.Cell>
							</Table.Row>
						)}
					</Table.Body>
				</Table>
			</Container>
		</>
	);
}

export async function getServerSideProps({
	req,
	res,
}: {
	req: NextApiRequest;
	res: NextApiResponse;
}) {
	const supabase = await createServerSupabaseClient<Database>({
		req,
		res,
	});

	const lists = await getListsForUser(supabase);
	return { props: { lists } };
}
