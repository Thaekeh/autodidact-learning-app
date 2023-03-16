

export const getRouteForAllFlashcardLists = () => {
  return `/lists`;
};

export const getRouteForFlashcardList = (id: string) => {
  return `/lists/${id}`;
};

export const getRouteForPracticingFlashcardList = (id: string) => {
  return `/lists/practice/${id}`;
};
