export const DEFAULT_LANGUAGE = "en";
export const FALLBACK_LANGUAGE = "en";
export const LANGUAGE_STORAGE_KEY = "trekking-food-language";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "EN", name: "English" },
  { code: "ru", label: "RU", name: "Russian" },
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]["code"];

export const isSupportedLanguage = (value: string | null | undefined): value is SupportedLanguage =>
  SUPPORTED_LANGUAGES.some((language) => language.code === value);

export const getInitialLanguage = (storedLanguage: string | null | undefined): SupportedLanguage =>
  isSupportedLanguage(storedLanguage) ? storedLanguage : DEFAULT_LANGUAGE;
