export const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        products: "Products",
        recipes: "Recipes",
        categories: "Categories",
        hikings: "Hikings",
        about: "About",
        admin: "Admin",
      },
    },
  },
  ru: {
    translation: {
      nav: {
        home: "Главная",
        products: "Продукты",
        recipes: "Рецепты",
        categories: "Категории",
        hikings: "Походы",
        about: "О проекте",
        admin: "Админ",
      },
    },
  },
} as const;

export type TranslationKey = keyof typeof resources.en.translation.nav;
export type NavLabelKey = `nav.${TranslationKey}`;
