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
        hikings: {
          title: "Hikings",
        },
        hikingDetail: {
          title: "Hiking",
          backToHikings: "← Back to hikings",
          tabs: {
            overview: "Overview",
            foodPlan: "Food plan",
            shoppingList: "Shopping List",
            packsByDays: "Packs by Days",
            packsByUsers: "Packs by Users",
          },
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
        hikings: {
          title: "Походы",
        },
        hikingDetail: {
          title: "Поход",
          backToHikings: "← Назад к походам",
          tabs: {
            overview: "Обзор",
            foodPlan: "План питания",
            shoppingList: "Список покупок",
            packsByDays: "Пакеты по дням",
            packsByUsers: "Пакеты по участникам",
          },
        },
      },
    },
  },
} as const;

export type NavTranslationKey = keyof typeof resources.en.translation.nav;
export type NavLabelKey = `nav.${NavTranslationKey}`;
export type PageTitleKey = {
  [PageKey in keyof typeof resources.en.translation.pages]: (typeof resources.en.translation.pages)[PageKey] extends {
    title: string;
  }
    ? `pages.${PageKey}.title`
    : never;
}[keyof typeof resources.en.translation.pages];
