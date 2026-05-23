import { Link } from "react-router-dom";

import { MAIN_NAV } from "@/config/nav";
import { isAppAdmin } from "@/lib/auth-roles";
import { useAuth } from "@/providers/auth-provider";

export const TopMenu = () => {
  const { user } = useAuth();

  const visibleItems = MAIN_NAV.filter((item) => !item.requiresAppAdmin || isAppAdmin(user));

  return (
    <div className="flex gap-2">
      {visibleItems.map((item) => (
        <Link key={item.path} to={item.path} className="hover:underline">
          {item.label}
        </Link>
      ))}
    </div>
  );
};
