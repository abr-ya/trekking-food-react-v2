import type { HikingDayPackSummary, HikingProduct } from "@/types";

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

/** Calculates total weight (in grams) of a pack by summing total_quantity of all products */
export const calculatePackWeight = (products: HikingProduct[]): number => {
  return products.reduce((sum, p) => sum + p.total_quantity, 0);
};

/**
 * Converts weight in grams to a readable format.
 * If >= 1000g, shows as kg (e.g., "2.5 kg")
 * Otherwise shows as grams (e.g., "500 g")
 */
export const formatWeight = (grams: number): string => {
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(1)} kg`;
  }
  return `${grams} g`;
};

/** Product summary for display purposes */
export type ProductSummary = {
  id: string;
  name: string;
  totalQuantity: number;
};

/** Pack information grouped by day and pack number */
export type PackInfo = {
  packId: string;
  packNumber: number;
  dayNumber: number;
  totalWeight: number;
  products: ProductSummary[];
  itemCount: number;
  member_slot: number | null;
};

/** Day with all its packs organized by pack number */
export type PacksByDayData = {
  dayNumber: number;
  packs: Map<number, PackInfo>; // key = pack_number
  maxPackNumber: number;
};

/**
 * Groups hiking products by day and pack, organizing them for the PacksByUsers table display.
 *
 * Structure:
 * - Each entry is a day
 * - For each day, a Map of pack_number → PackInfo
 * - PackInfo contains weight, products list, and item count
 *
 * Products without a pack (hiking_day_pack_id = null) are excluded.
 * Empty packs from `dayPacks` are included with zero weight/items.
 */
export const groupProductsByDayAndPack = (
  hikingProducts: HikingProduct[],
  dayPacks: HikingDayPackSummary[] = [],
  daysTotal: number = 1,
): PacksByDayData[] => {
  // Group by day_number first
  const byDay = new Map<number, HikingProduct[]>();
  let maxDay = 0;

  for (const product of hikingProducts) {
    if (!product.hiking_day_pack_id) continue; // Skip unassigned products

    maxDay = Math.max(maxDay, product.day_number);
    const dayProducts = byDay.get(product.day_number) ?? [];
    dayProducts.push(product);
    byDay.set(product.day_number, dayProducts);
  }

  // Index dayPacks by (day, packNumber)
  const packsByDay = new Map<string, HikingDayPackSummary>();
  for (const pack of dayPacks) {
    const key = `${pack.day_number}-${pack.pack_number}`;
    packsByDay.set(key, pack);
  }

  // Also find max pack number from day_packs
  let maxPackFromDefs = 0;
  for (const pack of dayPacks) {
    maxDay = Math.max(maxDay, pack.day_number);
    maxPackFromDefs = Math.max(maxPackFromDefs, pack.pack_number);
  }

  // For each day, group by pack
  const result: PacksByDayData[] = [];
  const effectiveMaxDay = Math.max(maxDay, ...dayPacks.map((p) => p.day_number), daysTotal);

  for (let day = 1; day <= effectiveMaxDay; day++) {
    const dayProducts = byDay.get(day) ?? [];
    const packsByNumber = new Map<number, HikingProduct[]>();
    let maxPackNum = 0;

    for (const product of dayProducts) {
      const packNum = product.hiking_day_pack?.pack_number ?? null;
      if (packNum === null) continue;

      maxPackNum = Math.max(maxPackNum, packNum);
      const packProducts = packsByNumber.get(packNum) ?? [];
      packProducts.push(product);
      packsByNumber.set(packNum, packProducts);
    }

    // Convert to PackInfo objects
    const packs = new Map<number, PackInfo>();
    for (const [packNum, packProducts] of packsByNumber) {
      packs.set(packNum, {
        packId: packProducts[0].hiking_day_pack?.id ?? `pack-${day}-${packNum}`,
        packNumber: packNum,
        dayNumber: day,
        totalWeight: calculatePackWeight(packProducts),
        products: packProducts.map((p) => ({
          id: p.id,
          name: p.product_name,
          totalQuantity: p.total_quantity,
        })),
        itemCount: packProducts.length,
        member_slot: packProducts[0].hiking_day_pack?.member_slot ?? null,
      });
    }

    // Add empty packs from day_packs that aren't already in packs
    for (const packDef of packsByDay.values()) {
      if (packDef.day_number !== day) continue;
      if (packs.has(packDef.pack_number)) continue;
      packs.set(packDef.pack_number, {
        packId: packDef.id,
        packNumber: packDef.pack_number,
        dayNumber: day,
        totalWeight: 0,
        products: [],
        itemCount: 0,
        member_slot: packDef.member_slot,
      });
    }

    // Ensure we include all days up to daysTotal, even if no products/packs
    maxPackNum = Math.max(maxPackNum, maxPackFromDefs, ...packs.keys(), 0);

    // If no packs found for this day but day exists, still add empty result
    result.push({
      dayNumber: day,
      packs,
      maxPackNumber: maxPackNum,
    });
  }

  return result;
};
