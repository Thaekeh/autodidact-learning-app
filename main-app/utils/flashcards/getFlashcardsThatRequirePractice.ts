import { FlashcardRow } from "types";

export default function filterFlashcardsThatRequirePractice(
  flashcards: FlashcardRow[]
): FlashcardRow[] {
  return flashcards.filter((flashcard) => {
    return (
      flashcard.next_practice_date &&
      new Date(flashcard.next_practice_date) < new Date()
    );
  });
}
