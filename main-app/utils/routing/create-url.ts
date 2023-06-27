export const createUrl = (path: string, absoluteUrl: string): URL => {
  return new URL(path, absoluteUrl);
};
