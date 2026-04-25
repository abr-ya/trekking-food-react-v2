import { describe, expect, it } from "vitest";
import type { HikingProduct, HikingTripPack } from "@/types/hiking-product";
import {
  buildBaseTripAssignments,
  findTripPackColumn,
  getProductPackagingAggregate,
  groupProductsByRecipeId,
  groupRecipesByDays,
  groupTripPacksForUsers,
} from "./hiking-helpers";

function product(partial: Partial<HikingProduct> & Pick<HikingProduct, "id">): HikingProduct {
  return {
    hiking_id: "hiking-1",
    day_number: 1,
    eating_time_id: "meal-1",
    eating_time_name: "Breakfast",
    product_id: `product-${partial.id}`,
    product_name: "Ingredient",
    recipe_id: "recipe-1",
    recipe_name: "Oatmeal",
    personal_quantity: 1,
    total_quantity: 4,
    hiking_day_pack_id: null,
    hiking_trip_pack_id: null,
    packagingKind: "DAY_PACK",
    ...partial,
  };
}

function tripProduct(
  partial: Partial<HikingProduct> & Pick<HikingProduct, "id" | "hiking_trip_pack_id">,
  tripPack: HikingTripPack,
): HikingProduct {
  return product({
    ...partial,
    packagingKind: "TRIP_PACK",
    hiking_day_pack_id: null,
    hiking_trip_pack_id: tripPack.id,
    hiking_trip_pack: tripPack,
  });
}

describe("buildBaseTripAssignments", () => {
  it("groups all trip packs with the same member_slot into that column", () => {
    const tp1: HikingTripPack = { id: "tp-1", label: null, notes: null, member_slot: 1 };
    const tp2: HikingTripPack = { id: "tp-2", label: null, notes: null, member_slot: 1 };
    const data = groupTripPacksForUsers([
      tripProduct({ id: "l1", hiking_trip_pack_id: "tp-1", product_id: "p1" }, tp1),
      tripProduct({ id: "l2", hiking_trip_pack_id: "tp-2", product_id: "p2" }, tp2),
    ]);
    const ass = buildBaseTripAssignments(data, 3);
    expect(ass.get(1)).toEqual(["tp-1", "tp-2"]);
    expect(ass.get(2)).toEqual([]);
    expect(ass.get(3)).toEqual([]);
  });

  it("round-robins unassigned trip packs across member columns", () => {
    const tpa: HikingTripPack = { id: "tp-a", label: null, notes: null, member_slot: null };
    const tpb: HikingTripPack = { id: "tp-b", label: null, notes: null, member_slot: null };
    const data = groupTripPacksForUsers([
      tripProduct({ id: "l1", hiking_trip_pack_id: "tp-a" }, tpa),
      tripProduct({ id: "l2", hiking_trip_pack_id: "tp-b" }, tpb),
    ]);
    const ass = buildBaseTripAssignments(data, 2);
    expect(ass.get(1)).toEqual(["tp-a"]);
    expect(ass.get(2)).toEqual(["tp-b"]);
  });

  it("continues round-robin when there are more packs than columns", () => {
    const tpa: HikingTripPack = { id: "tp-a", label: null, notes: null, member_slot: null };
    const tpb: HikingTripPack = { id: "tp-b", label: null, notes: null, member_slot: null };
    const tpc: HikingTripPack = { id: "tp-c", label: null, notes: null, member_slot: null };
    const data = groupTripPacksForUsers([
      tripProduct({ id: "l1", hiking_trip_pack_id: "tp-a" }, tpa),
      tripProduct({ id: "l2", hiking_trip_pack_id: "tp-b" }, tpb),
      tripProduct({ id: "l3", hiking_trip_pack_id: "tp-c" }, tpc),
    ]);
    const ass = buildBaseTripAssignments(data, 2);
    expect(ass.get(1)).toEqual(["tp-a", "tp-c"]);
    expect(ass.get(2)).toEqual(["tp-b"]);
  });

  it("findTripPackColumn returns the column index for a pack id", () => {
    const ass = new Map<number, string[]>([
      [1, ["a", "b"]],
      [2, ["c"]],
    ]);
    expect(findTripPackColumn(ass, "b")).toBe(1);
    expect(findTripPackColumn(ass, "c")).toBe(2);
    expect(findTripPackColumn(ass, "x")).toBeUndefined();
  });
});

describe("groupProductsByRecipeId", () => {
  it("returns an empty array for an empty input", () => {
    expect(groupProductsByRecipeId([])).toEqual([]);
  });

  it("wraps a single product in one group", () => {
    const a = product({ id: "a" });
    expect(groupProductsByRecipeId([a])).toEqual([[a]]);
  });

  it("groups products that share the same recipe_id", () => {
    const r = "recipe-shared";
    const a = product({ id: "a", recipe_id: r, recipe_name: "Soup" });
    const b = product({ id: "b", recipe_id: r, recipe_name: "Soup", product_name: "Broth" });
    const groups = groupProductsByRecipeId([a, b]);
    expect(groups).toHaveLength(1);
    expect(groups[0]).toEqual([a, b]);
  });

  it("keeps separate groups for different recipe_ids in first-seen order", () => {
    const a = product({ id: "a", recipe_id: "r1" });
    const b = product({ id: "b", recipe_id: "r2" });
    const c = product({ id: "c", recipe_id: "r1", product_name: "Extra" });
    expect(groupProductsByRecipeId([a, b, c])).toEqual([[a, c], [b]]);
  });

  it("does not merge rows with empty recipe_id; each uses its own id as the group key", () => {
    const a = product({ id: "row-a", recipe_id: "", recipe_name: "" });
    const b = product({ id: "row-b", recipe_id: "", recipe_name: "" });
    expect(groupProductsByRecipeId([a, b])).toEqual([[a], [b]]);
  });
});

describe("groupRecipesByDays", () => {
  it("returns an empty array for an empty input", () => {
    expect(groupRecipesByDays([])).toEqual([]);
  });

  it("collects unique day numbers per recipe and sorts them ascending", () => {
    const a = product({ id: "a", recipe_id: "r1", recipe_name: "Borscht", day_number: 3 });
    const b = product({ id: "b", recipe_id: "r1", recipe_name: "Borscht", day_number: 1 });
    const c = product({ id: "c", recipe_id: "r1", recipe_name: "Borscht", day_number: 5 });
    const dup = product({ id: "d", recipe_id: "r1", recipe_name: "Borscht", day_number: 3 });
    const result = groupRecipesByDays([a, b, c, dup]);
    expect(result).toEqual([{ recipeId: "r1", recipeName: "Borscht", days: [1, 3, 5] }]);
  });

  it("ignores rows with empty recipe_id", () => {
    const a = product({ id: "a", recipe_id: "", recipe_name: "Snack", day_number: 1 });
    const b = product({ id: "b", recipe_id: "r2", recipe_name: "Buckwheat", day_number: 4 });
    expect(groupRecipesByDays([a, b])).toEqual([
      { recipeId: "r2", recipeName: "Buckwheat", days: [4] },
    ]);
  });

  it("sorts recipes alphabetically case-insensitively within Latin and Cyrillic alphabets", () => {
    const a = product({ id: "1", recipe_id: "r-a", recipe_name: "borscht", day_number: 1 });
    const b = product({ id: "2", recipe_id: "r-b", recipe_name: "Apple pie", day_number: 1 });
    const c = product({ id: "3", recipe_id: "r-c", recipe_name: "Каша", day_number: 1 });
    const d = product({ id: "4", recipe_id: "r-d", recipe_name: "арбуз", day_number: 1 });
    const latin = groupRecipesByDays([a, b]).map((r) => r.recipeId);
    const cyrillic = groupRecipesByDays([c, d]).map((r) => r.recipeId);
    expect(latin).toEqual(["r-b", "r-a"]);
    expect(cyrillic).toEqual(["r-d", "r-c"]);
  });
});

describe("getProductPackagingAggregate", () => {
  const pid = "product-x";

  it("returns em dash when there are no lines for that product", () => {
    expect(getProductPackagingAggregate(pid, [])).toEqual({ label: "—", canPromoteToTripPack: false });
  });

  it("returns Day pack and can promote when all lines are DAY_PACK", () => {
    const lines = [
      product({ id: "1", product_id: pid, packagingKind: "DAY_PACK" }),
      product({ id: "2", product_id: pid, packagingKind: "DAY_PACK" }),
    ];
    expect(getProductPackagingAggregate(pid, lines)).toEqual({ label: "Day pack", canPromoteToTripPack: true });
  });

  it("returns Trip pack and cannot promote when all lines are TRIP_PACK", () => {
    const lines = [product({ id: "1", product_id: pid, packagingKind: "TRIP_PACK" })];
    expect(getProductPackagingAggregate(pid, lines)).toEqual({ label: "Trip pack", canPromoteToTripPack: false });
  });

  it("returns Mixed and can promote when both kinds exist", () => {
    const lines = [
      product({ id: "1", product_id: pid, packagingKind: "DAY_PACK" }),
      product({ id: "2", product_id: pid, packagingKind: "TRIP_PACK" }),
    ];
    expect(getProductPackagingAggregate(pid, lines)).toEqual({ label: "Mixed", canPromoteToTripPack: true });
  });
});
