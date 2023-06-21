import { DateTime } from "luxon";
import { FlashcardRow } from "types";
import getFlashcardsThatRequirePractice from "./getFlashcardsThatRequirePractice";

describe("utils/flashcards/getFlashcardsThatRequirePractice", () => {
  it("should return an empty array if there are no flashcards", () => {
    const flashcards: FlashcardRow[] = [];
    const result = getFlashcardsThatRequirePractice(flashcards);
    expect(result).toEqual([]);
  });

  it("should return an empty array if there are no flashcards that require practice", () => {
    const flashcards: FlashcardRow[] = [
      {
        id: "1",
        frontText: "front",
        backText: "back",
        list_id: "1",
        user_id: "1",
        created_at: new Date().toString(),
        next_practice_date: DateTime.now().plus({ days: 1 }).toString(),
        interval: 1,
        ease_factor: 1,
        repetitions: 1,
      },
    ];
    const result = getFlashcardsThatRequirePractice(flashcards);
    expect(result).toEqual([]);
  });

  it("should return an array of flashcards that require practice", () => {
    const flashcards: FlashcardRow[] = [
      {
        id: "1",
        frontText: "front",
        backText: "back",
        list_id: "1",
        user_id: "1",
        created_at: new Date().toString(),
        next_practice_date: DateTime.now().minus({ days: 1 }).toString(),
        interval: 1,
        ease_factor: 1,
        repetitions: 1,
      },
    ];
    const result = getFlashcardsThatRequirePractice(flashcards);
    expect(result).toEqual(flashcards);
  });

  it("should correctly filter out flashcards that don't require practice", () => {
    const flashcards: FlashcardRow[] = [
      {
        id: "1",
        frontText: "front",
        backText: "back",
        list_id: "1",
        user_id: "1",
        created_at: new Date().toString(),
        next_practice_date: DateTime.now().plus({ days: 1 }).toString(),
        interval: 1,
        ease_factor: 1,
        repetitions: 1,
      },
      {
        id: "2",
        frontText: "front",
        backText: "back",
        list_id: "1",
        user_id: "1",
        created_at: new Date().toString(),
        next_practice_date: DateTime.now().minus({ days: 1 }).toString(),
        interval: 1,
        ease_factor: 1,
        repetitions: 1,
      },
    ];
    const result = getFlashcardsThatRequirePractice(flashcards);
    expect(result).toEqual(flashcards.slice(1));
  });
});
