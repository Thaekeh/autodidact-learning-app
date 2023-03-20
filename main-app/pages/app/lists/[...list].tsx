import {
  Button,
  Container,
  Spacer,
  Table,
  Text,
  theme,
  useModal,
} from "@nextui-org/react";
import React, { useState } from "react";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "types/supabase";
import { NextApiRequest, NextApiResponse } from "next";
import { FlashcardListRow } from "types/FlashcardLists";
import { getListById, getRouteForPracticingFlashcardList } from "utils";
import { Check, Edit2, Play, Plus, Trash, X } from "react-feather";
import { IconButton } from "components/buttons/IconButton";
import {
  createNewFlashcard,
  deleteFlashcard,
  getFlashcardsForList,
  getFlashcardsThatRequirePracticeByListId,
  updateFlashcard,
} from "utils/supabase/flashcards";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { FlashcardRow } from "types";
import { NewFlashcardModal } from "components/modals/NewFlashcardModal";
import { EditFlashcardModal } from "components/modals/EditFlashcardModal";
import { useRouter } from "next/router";
import { DateTime } from "luxon";

export default function ListPage({
  list,
  flashcards,
  flashcardsToPracticeCount,
}: {
  list: FlashcardListRow | null;
  flashcards: FlashcardRow[] | null;
  flashcardsToPracticeCount: number | null;
}) {
  const [selectedFlashcard, setSelectedFlashcard] = useState<
    FlashcardRow | undefined
  >(undefined);

  const {
    visible: newFlashcardModalIsVisible,
    setVisible: setNewFlashcardModalIsVisible,
  } = useModal(false);

  const {
    visible: editFlashcardModalIsVisible,
    setVisible: setEditFlashcardModalIsVisible,
  } = useModal(false);
  const supabase = useSupabaseClient();

  const onEditFlashcardConfirm = async ({
    frontText,
    backText,
  }: {
    frontText: string;
    backText: string;
  }) => {
    if (!list || !selectedFlashcard) return;
    setEditFlashcardModalIsVisible(false);
    await updateFlashcard(
      supabase,
      selectedFlashcard?.id,
      frontText,
      backText,
      list.id
    );
  };

  const editFlashcardButtonHandler = (flashcard: FlashcardRow) => {
    setSelectedFlashcard(flashcard);
    setEditFlashcardModalIsVisible(true);
  };

  const onNewFlashcardConfirm = () => {
    if (!list) return;
    createNewFlashcard(supabase, "test front", "test back", list.id);
    setNewFlashcardModalIsVisible(false);
  };

  const handleDeleteFlashcard = (flashcardId: string) => {
    deleteFlashcard(supabase, flashcardId);
  };

  const router = useRouter();

  return (
    <>
      <Container>
        <Spacer y={2}></Spacer>
        {list && (
          <Container
            display="flex"
            direction="row"
            justify="space-between"
            alignContent="center"
          >
            <Text h3>{list?.name}</Text>
            <Text>{flashcardsToPracticeCount} card(s) to practice</Text>
            <Button
              disabled={!flashcardsToPracticeCount}
              size={"md"}
              icon={<Play size={16} />}
              onClick={() =>
                router.push(getRouteForPracticingFlashcardList(list.id))
              }
            >
              Practice
            </Button>
          </Container>
        )}

        <Table>
          <Table.Header>
            <Table.Column>Front</Table.Column>
            <Table.Column>Back</Table.Column>
            <Table.Column>Next practice date</Table.Column>
            <Table.Column>Learned</Table.Column>
            <Table.Column>
              <IconButton onClick={() => setNewFlashcardModalIsVisible(true)}>
                <Plus />
              </IconButton>
            </Table.Column>
          </Table.Header>
          <Table.Body>
            {flashcards ? (
              flashcards?.map((flashcard) => {
                return (
                  <Table.Row key={flashcard.id}>
                    <Table.Cell>{flashcard.frontText || "Empty"}</Table.Cell>
                    <Table.Cell>{flashcard.backText || "Empty"}</Table.Cell>
                    <Table.Cell>
                      {flashcard.next_practice_date &&
                        DateTime.fromISO(
                          flashcard.next_practice_date
                        ).toLocaleString()}
                    </Table.Cell>
                    <Table.Cell>
                      {flashcard.interval > 21 && (
                        <Check color={theme.colors.green700.value} />
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <Button.Group>
                        <IconButton
                          onClick={() => editFlashcardButtonHandler(flashcard)}
                        >
                          <Edit2 />
                        </IconButton>
                        <Spacer x={1}></Spacer>
                        <IconButton
                          onClick={() => handleDeleteFlashcard(flashcard.id)}
                        >
                          <Trash color={theme.colors.red700.value} />
                        </IconButton>
                      </Button.Group>
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
      <NewFlashcardModal
        isOpen={newFlashcardModalIsVisible}
        onCancel={() => setNewFlashcardModalIsVisible(false)}
        onConfirm={onNewFlashcardConfirm}
      />
      {editFlashcardModalIsVisible && (
        <EditFlashcardModal
          isOpen={editFlashcardModalIsVisible}
          initialContent={{
            frontText: selectedFlashcard?.frontText || "",
            backText: selectedFlashcard?.backText || "",
          }}
          onCancel={() => setEditFlashcardModalIsVisible(false)}
          onConfirm={onEditFlashcardConfirm}
        />
      )}
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
  const list = await getListById(supabase, listId);

  const flashcardsThatRequirePractice = await (
    await getFlashcardsThatRequirePracticeByListId(supabase, listId)
  ).data?.length;

  const flashcards = await getFlashcardsForList(supabase, listId);
  return {
    props: {
      list: list,
      flashcards,
      flashcardsToPracticeCount: flashcardsThatRequirePractice || 0,
    },
  };
}
