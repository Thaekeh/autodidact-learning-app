import { describe, expect } from "@jest/globals";
import {
  calculateNewCardRepetitionData,
  CalculateNewCardRepetitionDataProps,
  FlashcardResponseDifficulty,
  mapFlashcardDifficultyToNumber,
} from "./flashcards";

describe("flashcards utils", () => {
  describe("mapFlashcardDifficultyToNumber", () => {
    const data: {
      difficulty: FlashcardResponseDifficulty;
      expected: number;
    }[] = [
      { difficulty: "difficult", expected: 1 },
      { difficulty: "okay", expected: 3 },
      { difficulty: "easy", expected: 4 },
    ];

    it.each(data)(
      `should map $difficulty to $expected`,
      ({ difficulty, expected }) => {
        expect(mapFlashcardDifficultyToNumber(difficulty)).toEqual(expected);
      }
    );
  });

  describe("calculateNewCardRepetitionData", () => {
    it("should return old interval and easeFactor if difficultyResponse is difficult ", () => {
      const testData: CalculateNewCardRepetitionDataProps = {
        difficultyResponse: "difficult",
        easeFactor: 2.5,
        repetitions: 0,
        interval: 1,
      };
      const response = calculateNewCardRepetitionData(testData);
      expect(response).toEqual({
        easeFactor: 2.5,
        repetitions: 0,
        interval: 1,
      });
    });
    it("should reset repetitions to 0 if difficultyResponse is difficult ", () => {
      const testData: CalculateNewCardRepetitionDataProps = {
        difficultyResponse: "difficult",
        easeFactor: 2.5,
        repetitions: 15,
        interval: 1,
      };
      const response = calculateNewCardRepetitionData(testData);
      expect(response.repetitions).toEqual(0);
    });

    it("should increment repetitions and change easeFactor when difficultyResponse is okay", () => {
      const testData: CalculateNewCardRepetitionDataProps = {
        difficultyResponse: "okay",
        easeFactor: 2.5,
        repetitions: 0,
        interval: 1,
      };
      const response = calculateNewCardRepetitionData(testData);
      expect(response).toEqual({
        easeFactor: 2.36,
        repetitions: 1,
        interval: 1,
      });
    });
    it("should increment repetitions when difficultyResponse is easy ", () => {
      const testData: CalculateNewCardRepetitionDataProps = {
        difficultyResponse: "easy",
        easeFactor: 2.5,
        repetitions: 0,
        interval: 1,
      };
      const response = calculateNewCardRepetitionData(testData);
      expect(response.repetitions).toEqual(1);
    });

    it("should return interval 6 when repetitions is 2", () => {
      const testData: CalculateNewCardRepetitionDataProps = {
        difficultyResponse: "easy",
        easeFactor: 2.5,
        repetitions: 2,
        interval: 1,
      };
      const response = calculateNewCardRepetitionData(testData);
      expect(response.interval).toBe(6);
    });

    it("should change interval when repetitions is 2 and difficultyResponse is easy ", () => {
      const testData: CalculateNewCardRepetitionDataProps = {
        difficultyResponse: "easy",
        easeFactor: 2.5,
        repetitions: 3,
        interval: 6,
      };
      const response = calculateNewCardRepetitionData(testData);
      expect(response.interval).toBe(15);
    });
  });
});
