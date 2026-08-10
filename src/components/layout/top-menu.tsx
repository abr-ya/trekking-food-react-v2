import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { MAIN_NAV, routes } from "@/config/nav";
import { isAppAdmin } from "@/lib/auth-roles";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

export const TopMenu = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const visibleItems = MAIN_NAV.filter((item) => !item.requiresAppAdmin || isAppAdmin(user));

  return (
    <div className="flex gap-2">
      {visibleItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === routes.home}
          className={({ isActive }) =>
            cn("hover:underline", isActive ? "font-semibold text-foreground underline" : "text-muted-foreground")
          }
        >
          {t(item.labelKey)}
        </NavLink>
      ))}
    </div>
  );
};
