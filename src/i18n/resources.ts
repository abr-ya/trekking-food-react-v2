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
      pages: {
        products: {
          title: "Products Page",
        },
        recipes: {
          title: "Recipes",
        },
        categories: {
          title: "Categories",
        },
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
      pages: {
        products: {
          title: "Страница продуктов",
        },
        recipes: {
          title: "Рецепты",
        },
        categories: {
          title: "Категории",
        },
      },
    },
  },
} as const;

export type NavTranslationKey = keyof typeof resources.en.translation.nav;
export type NavLabelKey = `nav.${NavTranslationKey}`;
export type PageTitleKey = `pages.${keyof typeof resources.en.translation.pages}.title`;
