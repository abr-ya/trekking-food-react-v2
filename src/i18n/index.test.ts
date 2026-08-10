import { describe, expect, it } from "vitest";

import { DEFAULT_LANGUAGE, getInitialLanguage, isSupportedLanguage } from "./locales";
import { resources, type NavLabelKey, type ProductsPageTitleKey } from "./resources";

const navLabelKeys = [
  "nav.home",
  "nav.products",
  "nav.recipes",
  "nav.categories",
  "nav.hikings",
  "nav.about",
  "nav.admin",
] satisfies NavLabelKey[];

const productsPageTitleKey = "pages.products.title" satisfies ProductsPageTitleKey;

describe("i18n resources", () => {
  it("supports only declared app languages", () => {
    expect(isSupportedLanguage("en")).toBe(true);
    expect(isSupportedLanguage("ru")).toBe(true);
    expect(isSupportedLanguage("fr")).toBe(false);
  });

  it("falls back to English for missing or unsupported saved languages", () => {
    expect(getInitialLanguage(null)).toBe(DEFAULT_LANGUAGE);
    expect(getInitialLanguage("fr")).toBe(DEFAULT_LANGUAGE);
    expect(getInitialLanguage("ru")).toBe("ru");
  });

  it("defines English and Russian top-menu labels for every nav key", () => {
    for (const key of navLabelKeys) {
      const [, navKey] = key.split(".") as ["nav", keyof typeof resources.en.translation.nav];

      expect(resources.en.translation.nav[navKey]).toBeTruthy();
      expect(resources.ru.translation.nav[navKey]).toBeTruthy();
    }
  });

  it("defines English and Russian Products page title labels", () => {
    const [, , titleKey] = productsPageTitleKey.split(".") as [
      "pages",
      "products",
      keyof typeof resources.en.translation.pages.products,
    ];

    expect(resources.en.translation.pages.products[titleKey]).toBe("Products Page");
    expect(resources.ru.translation.pages.products[titleKey]).toBe("Страница продуктов");
  });
});
