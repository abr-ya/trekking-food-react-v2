import type { HikingProduct } from "@/types/hiking-product";

/** Groups rows that share the same recipe. Uses `recipe_id || id` so empty recipe ids do not merge unrelated rows. */
export const groupProductsByRecipeId = (products: HikingProduct[]): HikingProduct[][] => {
  const map = new Map<string, HikingProduct[]>();
  for (const p of products) {
    const key = p.recipe_id || p.id;
    const bucket = map.get(key);
    if (bucket) bucket.push(p);
    else map.set(key, [p]);
  }

  return Array.from(map.values());
};
