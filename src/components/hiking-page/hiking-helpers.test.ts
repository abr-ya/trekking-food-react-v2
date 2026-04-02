import { describe, expect, it } from "vitest";
import type { HikingProduct } from "@/types/hiking-product";
import { groupProductsByRecipeId } from "./hiking-helpers";

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
    ...partial,
  };
}

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
