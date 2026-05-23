import { NavLink } from "react-router-dom";

import { ADMIN_NAV } from "@/config/nav";
import { cn } from "@/lib/utils";

export const AdminSidebar = () => (
  <nav className="w-44 shrink-0 border-r pr-4" aria-label="Admin navigation">
    <ul className="flex flex-col gap-1 text-sm">
      {ADMIN_NAV.map((item) => (
        <li key={item.path}>
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              cn(
                "block rounded-md px-2 py-1.5 hover:bg-muted",
                isActive ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:text-foreground",
              )
            }
          >
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
);
