import { Button, Spacer, useDisclosure } from "@nextui-org/react";
import React, { useState } from "react";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "types/supabase";
import { NextApiRequest, NextApiResponse } from "next";
import { FlashcardListRow } from "types/FlashcardLists";
import { getListById, getRouteForPracticingFlashcardList } from "utils";
import { Play } from "react-feather";
import {
  createNewFlashcard,
  deleteFlashcard,
  getFlashcardsForList,
  getFlashcardsThatRequirePracticeByListId,
  updateFlashcard,
} from "utils/supabase/flashcards";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { FlashcardRow } from "types";
import { NewFlashcardModal } from "components/modals/flashcards/NewFlashcardModal";
import { EditFlashcardModal } from "components/modals/flashcards/EditFlashcardModal";
import { useRouter } from "next/navigation";
import { FlashcardsTable } from "components/table/FlashcardsTable";
import { useConfirm } from "hooks/useConfirm";

export default function ListPage({
  list,
  flashcards: flashcardsProp,
  flashcardsToPracticeCount,
}: {
  list: FlashcardListRow | null;
  flashcards: FlashcardRow[];
  flashcardsToPracticeCount: number | null;
}) {
  const [selectedFlashcard, setSelectedFlashcard] = useState<
    FlashcardRow | undefined
  >(undefined);
  const [flashcards, setFlashcards] = useState<FlashcardRow[]>(flashcardsProp);

  const { isConfirmed } = useConfirm();

  // const {
  //   visible: newFlashcardModalIsVisible,
  //   setVisible: setNewFlashcardModalIsVisible,
  // } = useModal(false);

  const {
    isOpen: newFlashcardModalIsOpen,
    onOpen: setNewFlashcardModalIsOpen,
    onOpenChange: onFlashcardModalIsOpenChange,
  } = useDisclosure();

  const {
    isOpen: editFlashcardModalIsOpen,
    onOpen: setEditFlashcardModalIsOpen,
    onOpenChange: onEditFlashcardModalIsOpenChange,
  } = useDisclosure();

  const supabase = useSupabaseClient();

  const onEditFlashcardConfirm = async ({
    frontText,
    backText,
  }: {
    frontText: string;
    backText: string;
  }) => {
    if (!list || !selectedFlashcard) return;
    onEditFlashcardModalIsOpenChange();
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
    onEditFlashcardModalIsOpenChange();
  };

  const onNewFlashcardConfirm = () => {
    if (!list) return;
    createNewFlashcard(supabase, "test front", "test back", list.id);
    onFlashcardModalIsOpenChange();
  };

  const handleDeleteFlashcard = async (flashcardId: string) => {
    if (!list?.id) return;
    const confirmed = await isConfirmed("Are you sure?");
    if (confirmed) {
      await deleteFlashcard(supabase, flashcardId);
      const newFlashcards = await getFlashcardsForList(supabase, list?.id);
      setFlashcards(newFlashcards);
    }
  };

  const router = useRouter();

  return (
    <>
      <div className="container mx-auto">
        <Spacer y={2}></Spacer>
        {list && (
          <div className="flex flex-row justify-between items-center">
            <h3>{list?.name}</h3>
            <p>{flashcardsToPracticeCount} card(s) to practice</p>
            <Button
              disabled={!flashcardsToPracticeCount}
              size={"md"}
              endIcon={<Play size={16} />}
              onClick={() =>
                router.push(getRouteForPracticingFlashcardList(list.id))
              }
            >
              Practice
            </Button>
          </div>
        )}
        <FlashcardsTable
          flashcards={flashcards}
          editCallback={editFlashcardButtonHandler}
          deleteCallback={handleDeleteFlashcard}
        />
        {/* <Table>
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
        </Table> */}
      </div>
      <NewFlashcardModal
        isOpen={newFlashcardModalIsOpen}
        onCancel={onFlashcardModalIsOpenChange}
        onConfirm={onNewFlashcardConfirm}
      />

      <EditFlashcardModal
        isOpen={editFlashcardModalIsOpen}
        initialContent={{
          frontText: selectedFlashcard?.frontText || "",
          backText: selectedFlashcard?.backText || "",
        }}
        onCancel={onEditFlashcardModalIsOpenChange}
        onConfirm={onEditFlashcardConfirm}
      />
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
