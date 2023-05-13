import supportedLanguages from "./azureSupportedLanguages.json";

export type SupportedLanguage = {
  name: string;
  key: string;
  nativeName: string;
};

export const getSupportedLanguages = (): SupportedLanguage[] => {
  return supportedLanguages;
};
