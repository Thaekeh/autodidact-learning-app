export const getRouteForAllFlashcardLists = () => {
  return `/main/lists`;
};

export const getRouteForFlashcardList = (id: string) => {
  return `/main/lists/${id}`;
};

export const getRouteForPracticingFlashcardList = (id: string) => {
  return `/main/lists/practice/${id}`;
};
