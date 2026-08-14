import { describe, expect, it } from "vitest";

import { DEFAULT_LANGUAGE, getInitialLanguage, isSupportedLanguage } from "./locales";
import { resources, type NavLabelKey, type PageTitleKey } from "./resources";

const navLabelKeys = [
  "nav.home",
  "nav.products",
  "nav.recipes",
  "nav.categories",
  "nav.hikings",
  "nav.about",
  "nav.admin",
] satisfies NavLabelKey[];

const pageTitleKeys = [
  "pages.products.title",
  "pages.recipes.title",
  "pages.categories.title",
  "pages.hikings.title",
] satisfies PageTitleKey[];

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

  it("defines English and Russian page title labels", () => {
    for (const key of pageTitleKeys) {
      const [, pageKey, titleKey] = key.split(".") as ["pages", keyof typeof resources.en.translation.pages, "title"];

      expect(resources.en.translation.pages[pageKey][titleKey]).toBeTruthy();
      expect(resources.ru.translation.pages[pageKey][titleKey]).toBeTruthy();
    }

    expect(resources.en.translation.pages.products.title).toBe("Products Page");
    expect(resources.ru.translation.pages.products.title).toBe("Страница продуктов");
    expect(resources.en.translation.pages.recipes.title).toBe("Recipes");
    expect(resources.ru.translation.pages.recipes.title).toBe("Рецепты");
    expect(resources.en.translation.pages.categories.title).toBe("Categories");
    expect(resources.ru.translation.pages.categories.title).toBe("Категории");
    expect(resources.en.translation.pages.hikings.title).toBe("Hikings");
    expect(resources.ru.translation.pages.hikings.title).toBe("Походы");
  });

  it("defines English and Russian Hiking detail page chrome labels", () => {
    expect(resources.en.translation.pages.hikingDetail.title).toBe("Hiking");
    expect(resources.ru.translation.pages.hikingDetail.title).toBe("Поход");
    expect(resources.en.translation.pages.hikingDetail.backToHikings).toBe("← Back to hikings");
    expect(resources.ru.translation.pages.hikingDetail.backToHikings).toBe("← Назад к походам");

    for (const tabKey of ["overview", "foodPlan", "shoppingList", "packsByDays", "packsByUsers"] as const) {
      expect(resources.en.translation.pages.hikingDetail.tabs[tabKey]).toBeTruthy();
      expect(resources.ru.translation.pages.hikingDetail.tabs[tabKey]).toBeTruthy();
    }
  });
});
