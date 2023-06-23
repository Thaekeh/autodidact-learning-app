"use client";
import { Button, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { FlashcardListRow } from "types/FlashcardLists";
import { getListById, getRouteForPracticingFlashcardList } from "utils";
import { Play } from "react-feather";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  createNewFlashcard,
  deleteFlashcard,
  getFlashcardsForList,
  updateFlashcard,
} from "utils/supabase/flashcards";
import { FlashcardRow } from "types";
import { NewFlashcardModal } from "components/modals/flashcards/NewFlashcardModal";
import { EditFlashcardModal } from "components/modals/flashcards/EditFlashcardModal";
import { FlashcardsTable } from "components/table/FlashcardsTable";
import { useConfirm } from "hooks/useConfirm";
import filterFlashcardsThatRequirePractice from "utils/flashcards/getFlashcardsThatRequirePractice";
import NextLink from "next/link";

export default function ListPage({ params }: { params: { id: string } }) {
  const [selectedFlashcard, setSelectedFlashcard] = useState<
    FlashcardRow | undefined
  >(undefined);
  const [flashcards, setFlashcards] = useState<FlashcardRow[]>([]);

  const { isConfirmed } = useConfirm();

  const [list, setList] = useState<FlashcardListRow | null>();

  const [flashcardsToPractice, setFlashcardsToPractice] = useState<
    FlashcardRow[]
  >([]);

  const {
    isOpen: newFlashcardModalIsOpen,
    onOpenChange: onFlashcardModalIsOpenChange,
  } = useDisclosure();

  const {
    isOpen: editFlashcardModalIsOpen,
    onOpenChange: onEditFlashcardModalIsOpenChange,
  } = useDisclosure();

  const supabaseClient = createClientComponentClient();

  useEffect(() => {
    getListById(supabaseClient, params.id).then((list) => {
      setList(list);
    });
    getFlashcardsForList(supabaseClient, params.id).then((flashcards) => {
      setFlashcards(flashcards);

      const flashcardsToPractice =
        filterFlashcardsThatRequirePractice(flashcards);
      setFlashcardsToPractice(flashcardsToPractice);
    });
  }, [params.id]);

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
      supabaseClient,
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
    createNewFlashcard(supabaseClient, "test front", "test back", list.id);
    onFlashcardModalIsOpenChange();
  };

  const handleDeleteFlashcard = async (flashcardId: string) => {
    if (!list?.id) return;
    const confirmed = await isConfirmed("Are you sure?");
    if (confirmed) {
      await deleteFlashcard(supabaseClient, flashcardId);
      const newFlashcards = await getFlashcardsForList(
        supabaseClient,
        list?.id
      );
      setFlashcards(newFlashcards);
    }
  };

  return (
    <>
      <div className="container mx-auto mt-6">
        {list && (
          <div className="flex flex-row justify-between items-center mb-4">
            <h3>{list?.name}</h3>
            <p>{flashcardsToPractice.length} card(s) to practice</p>
            <Button
              as={NextLink}
              href={getRouteForPracticingFlashcardList(list.id)}
              disabled={!flashcardsToPractice}
              size={"md"}
              variant={"flat"}
              color={"secondary"}
              endContent={<Play size={16} />}
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
