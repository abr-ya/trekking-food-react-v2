import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import { FALLBACK_LANGUAGE, getInitialLanguage, LANGUAGE_STORAGE_KEY } from "./locales";
import { resources } from "./resources";

const getSavedLanguage = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
};

void i18next.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(getSavedLanguage()),
  fallbackLng: FALLBACK_LANGUAGE,
  interpolation: {
    escapeValue: false,
  },
});

i18next.on("languageChanged", (language) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, getInitialLanguage(language));
});

export { i18next };
