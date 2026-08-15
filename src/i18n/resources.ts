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
          overview: {
            invalidId: "Hiking id not correct.",
            loadError: "Failed to load hiking: {{message}}",
            unknownError: "Unknown error",
            notFound: "Hiking not found.",
            daysTotal: "Days total:",
            membersTotal: "Members total:",
            vegetariansTotal: "Vegetarians total:",
            created: "Created:",
            createdBy: "Created by:",
            updated: "Updated:",
            admins: "Admins:",
            noAdmins: "No admins yet.",
            editMembers: {
              changeButton: "Change",
              title: "Change group size",
              description:
                "Update the number of members in this hiking plan. Minimum group size: {{count}} {{vegetarianLabel}}. Editing vegetarians count is not available yet.",
              vegetarianSingular: "(vegetarian)",
              vegetarianPlural: "(vegetarians)",
              membersTotalLabel: "Members total",
              requestFailed: "Request failed.",
              cancel: "Cancel",
              continue: "Continue",
              saving: "Saving…",
              confirmTitle: "Decrease group size to {{count}}?",
              confirmIntro: "This action cannot be undone from the UI. The server will:",
              confirmBulletRecalc:
                "Recalculate every product total as personal quantity × new group size (manual totals are lost)",
              confirmBulletDeletePacks:
                "Delete day packs with pack number greater than {{count}} — their meals become unassigned",
              confirmBulletClearSlots: "Clear member slots greater than {{count}} on day packs and trip packs",
              confirmDecrease: "Yes, decrease",
              toastIncreased:
                "Group size increased. Product totals were updated. Run Auto-distribute on each day if you need new member packs.",
              toastDecreased:
                "Group size decreased to {{count}}. Extra day packs were removed and member slots above {{count}} were cleared.",
              toastUpdated: "Group size updated.",
            },
            addAdmin: {
              addButton: "Add admin",
              title: "Add admin",
              description: "Enter the user ID to grant admin access to this hiking plan.",
              userIdLabel: "User ID",
              userIdPlaceholder: "e.g. a1b2c3d4-e5f6-4789-a012-345678901234",
              requestFailed: "Request failed.",
              cancel: "Cancel",
              submit: "Add admin",
              adding: "Adding…",
            },
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
          overview: {
            invalidId: "Некорректный идентификатор похода.",
            loadError: "Не удалось загрузить поход: {{message}}",
            unknownError: "Неизвестная ошибка",
            notFound: "Поход не найден.",
            daysTotal: "Всего дней:",
            membersTotal: "Всего участников:",
            vegetariansTotal: "Всего вегетарианцев:",
            created: "Создан:",
            createdBy: "Создал:",
            updated: "Обновлён:",
            admins: "Администраторы:",
            noAdmins: "Администраторов пока нет.",
            editMembers: {
              changeButton: "Изменить",
              title: "Изменить размер группы",
              description:
                "Обновите число участников этого похода. Минимальный размер группы: {{count}} {{vegetarianLabel}}. Редактирование числа вегетарианцев пока недоступно.",
              vegetarianSingular: "(вегетарианец)",
              vegetarianPlural: "(вегетарианцев)",
              membersTotalLabel: "Всего участников",
              requestFailed: "Запрос не выполнен.",
              cancel: "Отмена",
              continue: "Продолжить",
              saving: "Сохранение…",
              confirmTitle: "Уменьшить размер группы до {{count}}?",
              confirmIntro: "Это действие нельзя отменить из интерфейса. Сервер:",
              confirmBulletRecalc:
                "Пересчитает итоги по каждому продукту как личная норма × новый размер группы (ручные итоги будут потеряны)",
              confirmBulletDeletePacks:
                "Удалит дневные пакеты с номером больше {{count}} — их приёмы пищи станут неназначенными",
              confirmBulletClearSlots: "Очистит слоты участников больше {{count}} у дневных и походных пакетов",
              confirmDecrease: "Да, уменьшить",
              toastIncreased:
                "Размер группы увеличен. Итоги по продуктам обновлены. Запустите автораспределение по каждому дню, если нужны новые пакеты участников.",
              toastDecreased:
                "Размер группы уменьшен до {{count}}. Лишние дневные пакеты удалены, слоты участников выше {{count}} очищены.",
              toastUpdated: "Размер группы обновлён.",
            },
            addAdmin: {
              addButton: "Добавить админа",
              title: "Добавить админа",
              description: "Введите ID пользователя, чтобы дать права администратора этого похода.",
              userIdLabel: "ID пользователя",
              userIdPlaceholder: "напр. a1b2c3d4-e5f6-4789-a012-345678901234",
              requestFailed: "Запрос не выполнен.",
              cancel: "Отмена",
              submit: "Добавить админа",
              adding: "Добавление…",
            },
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
