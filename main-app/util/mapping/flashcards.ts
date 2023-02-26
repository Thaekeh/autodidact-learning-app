export type FlashcardResponseDifficulty = "difficult" | "okay" | "easy";

export const mapFlashcardDifficultyToNumber = (
	difficulty: FlashcardResponseDifficulty
) => {
	switch (difficulty) {
		case "difficult":
			return 1;
		case "okay":
			return 3;
		case "easy":
			return 4;
	}
};

export interface CalculateNewCardRepetitionDataProps {
	difficultyResponse: FlashcardResponseDifficulty;
	interval: number;
	easeFactor: number;
	repetitions: number;
}

export const calculateNewCardRepetitionData = (
	data: CalculateNewCardRepetitionDataProps
) => {
	const { difficultyResponse, easeFactor, interval, repetitions } = data;
	const difficultyResponseAsNumber =
		mapFlashcardDifficultyToNumber(difficultyResponse);

	if (difficultyResponseAsNumber < 3) {
		return {
			repetitions: 0,
			easeFactor: data.easeFactor,
			interval: data.interval,
		};
	}

	const newEaseFactor = calculateNewEaseFactor({
		responseQuality: difficultyResponseAsNumber,
		easeFactor: data.easeFactor,
	});

	return {
		repetitions: data.repetitions + 1,
		easeFactor: newEaseFactor,
		interval: calculateNewInterval({
			repetitions,
			easeFactor: newEaseFactor,
			interval,
		}),
	};
};

interface CalculateNewEaseFactorProps {
	responseQuality: number;
	easeFactor: number;
}

const calculateNewEaseFactor = ({
	responseQuality,
	easeFactor,
}: CalculateNewEaseFactorProps): number => {
	// TODO use consts for magic numbers to understand the algorithm
	return Math.max(
		1.3,
		easeFactor +
			(0.1 - (5 - responseQuality) * (0.08 + (5 - responseQuality) * 0.02))
	);
};

interface CalculateNewIntervalProps {
	repetitions: number;
	interval: number;
	easeFactor: number;
}

const calculateNewInterval = ({
	repetitions,
	interval,
	easeFactor,
}: CalculateNewIntervalProps) => {
	if (repetitions <= 1) {
		return 1;
	} else if (repetitions === 2) {
		return 6;
	} else {
		return Math.round(interval * easeFactor);
	}
};

// pseudo sr algorithm
// things to keep track of:
// - repetitions
// - easeFactor
// - practiceDate
// - interval