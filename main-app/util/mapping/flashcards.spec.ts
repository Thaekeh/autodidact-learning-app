import {describe, expect} from '@jest/globals';
import { FlashcardResponseDifficulty, mapFlashcardDifficultyToNumber } from './flashcards';

describe('test', () => {
    const mapFlashcardDifficultyToNumberData: {difficulty: FlashcardResponseDifficulty, expected: number}[] = [
        {difficulty: 'difficult', expected: 1},
        {difficulty: 'okay', expected: 3},
        {difficulty: 'easy', expected: 4},
    ]

    it.each(mapFlashcardDifficultyToNumberData)(`should map $difficulty to $expected`, ({difficulty, expected}) => {
        expect(mapFlashcardDifficultyToNumber(difficulty)).toEqual(expected);
    })
})

