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

  it("defines English and Russian Hiking Overview tab labels", () => {
    const enOverview = resources.en.translation.pages.hikingDetail.overview;
    const ruOverview = resources.ru.translation.pages.hikingDetail.overview;

    for (const key of [
      "invalidId",
      "loadError",
      "unknownError",
      "notFound",
      "daysTotal",
      "membersTotal",
      "vegetariansTotal",
      "created",
      "createdBy",
      "updated",
      "admins",
      "noAdmins",
    ] as const) {
      expect(enOverview[key]).toBeTruthy();
      expect(ruOverview[key]).toBeTruthy();
    }

    for (const key of [
      "changeButton",
      "title",
      "description",
      "vegetarianSingular",
      "vegetarianPlural",
      "membersTotalLabel",
      "requestFailed",
      "cancel",
      "continue",
      "saving",
      "confirmTitle",
      "confirmIntro",
      "confirmBulletRecalc",
      "confirmBulletDeletePacks",
      "confirmBulletClearSlots",
      "confirmDecrease",
      "toastIncreased",
      "toastDecreased",
      "toastUpdated",
    ] as const) {
      expect(enOverview.editMembers[key]).toBeTruthy();
      expect(ruOverview.editMembers[key]).toBeTruthy();
    }

    for (const key of [
      "addButton",
      "title",
      "description",
      "userIdLabel",
      "userIdPlaceholder",
      "requestFailed",
      "cancel",
      "submit",
      "adding",
    ] as const) {
      expect(enOverview.addAdmin[key]).toBeTruthy();
      expect(ruOverview.addAdmin[key]).toBeTruthy();
    }
  });

  it("interpolates dynamic Overview strings for English and Russian", () => {
    const enLoad = resources.en.translation.pages.hikingDetail.overview.loadError.replace(
      "{{message}}",
      "Network error",
    );
    const ruLoad = resources.ru.translation.pages.hikingDetail.overview.loadError.replace(
      "{{message}}",
      "Сетевая ошибка",
    );
    expect(enLoad).toBe("Failed to load hiking: Network error");
    expect(ruLoad).toBe("Не удалось загрузить поход: Сетевая ошибка");

    const enConfirm = resources.en.translation.pages.hikingDetail.overview.editMembers.confirmTitle.replace(
      "{{count}}",
      "3",
    );
    const ruConfirm = resources.ru.translation.pages.hikingDetail.overview.editMembers.confirmTitle.replace(
      "{{count}}",
      "3",
    );
    expect(enConfirm).toBe("Decrease group size to 3?");
    expect(ruConfirm).toBe("Уменьшить размер группы до 3?");

    const enToast = resources.en.translation.pages.hikingDetail.overview.editMembers.toastDecreased.replaceAll(
      "{{count}}",
      "4",
    );
    const ruToast = resources.ru.translation.pages.hikingDetail.overview.editMembers.toastDecreased.replaceAll(
      "{{count}}",
      "4",
    );
    expect(enToast).toContain("decreased to 4");
    expect(enToast).toContain("above 4");
    expect(ruToast).toContain("до 4");
    expect(ruToast).toContain("выше 4");
  });
});
