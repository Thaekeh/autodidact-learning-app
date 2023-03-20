export const getRouteForAllFlashcardLists = () => {
  return `/app/lists`;
};

export const getRouteForFlashcardList = (id: string) => {
  return `/app/lists/${id}`;
};

export const getRouteForPracticingFlashcardList = (id: string) => {
  return `/app/lists/practice/${id}`;
};
