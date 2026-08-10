import { describe, expect, it } from "vitest";

import { MAIN_NAV, TOP_LEVEL_ROUTE_PATHS } from "@/config/nav";

describe("MAIN_NAV", () => {
  it("every menu path matches a declared top-level route", () => {
    for (const item of MAIN_NAV) {
      expect(TOP_LEVEL_ROUTE_PATHS).toContain(item.path);
    }
  });

  it("marks Admin as app-admin-only and leaves other items ungated", () => {
    const admin = MAIN_NAV.find((item) => item.labelKey === "nav.admin");
    expect(admin?.requiresAppAdmin).toBe(true);

    const nonAdmin = MAIN_NAV.filter((item) => item.labelKey !== "nav.admin");
    expect(nonAdmin.length).toBeGreaterThan(0);
    for (const item of nonAdmin) {
      expect(item.requiresAppAdmin).toBeFalsy();
    }
  });

  it("uses stable translation keys for every menu item", () => {
    expect(MAIN_NAV.map((item) => item.labelKey)).toEqual([
      "nav.home",
      "nav.products",
      "nav.recipes",
      "nav.categories",
      "nav.hikings",
      "nav.about",
      "nav.admin",
    ]);
  });
});
