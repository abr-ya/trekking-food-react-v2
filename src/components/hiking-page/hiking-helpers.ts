import type { HikingDayPackSummary, HikingProduct } from "@/types";

/** Shopping List: aggregate packaging kinds for all hiking lines of one catalog product. */
export type ProductPackagingAggregate = {
  label: string;
  canPromoteToTripPack: boolean;
};

/**
 * Derives a display label (Day pack / Trip pack / Mixed) and whether promote-to-trip-pack applies
 * (at least one DAY_PACK line). If there are no lines, label is "—" and promote is false.
 */
export function getProductPackagingAggregate(
  productId: string,
  hikingProducts: HikingProduct[],
): ProductPackagingAggregate {
  const lines = hikingProducts.filter((p) => p.product_id === productId);
  if (lines.length === 0) {
    return { label: "—", canPromoteToTripPack: false };
  }

  const kinds = new Set(lines.map((p) => p.packagingKind));
  const hasDay = kinds.has("DAY_PACK");

  let label: string;
  if (kinds.size === 1) {
    label = [...kinds][0] === "DAY_PACK" ? "Day pack" : "Trip pack";
  } else {
    label = "Mixed";
  }

  return { label, canPromoteToTripPack: hasDay };
}

/** Recipe assigned to one or more days within a hiking plan. */
export type RecipeDays = {
  recipeId: string;
  recipeName: string;
  days: number[];
};

/**
 * Builds a list of recipes that appear in the hiking plan together with the unique day numbers
 * each recipe is scheduled for. Rows with empty `recipe_id` are ignored. Recipes are sorted by
 * `recipeName` using locale-aware case-insensitive comparison so Russian and Latin names mix
 * naturally; days within each recipe are unique and sorted ascending.
 */
export const groupRecipesByDays = (products: HikingProduct[]): RecipeDays[] => {
  const byRecipe = new Map<string, { recipeName: string; days: Set<number> }>();
  for (const p of products) {
    const id = p.recipe_id;
    if (!id) continue;
    const entry = byRecipe.get(id);
    if (entry) {
      entry.days.add(p.day_number);
    } else {
      byRecipe.set(id, { recipeName: p.recipe_name, days: new Set([p.day_number]) });
    }
  }

  return Array.from(byRecipe.entries())
    .map(([recipeId, { recipeName, days }]) => ({
      recipeId,
      recipeName,
      days: [...days].sort((a, b) => a - b),
    }))
    .sort((a, b) => a.recipeName.localeCompare(b.recipeName, undefined, { sensitivity: "base" }));
};

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
 * If >= 1000g, shows as kg with gram-level precision (up to 3 decimal places; trailing zeros trimmed).
 * Otherwise shows as grams (e.g., "500 g").
 */
export const formatWeight = (grams: number): string => {
  if (grams >= 1000) {
    const kg = grams / 1000;
    const exact = Number.parseFloat(kg.toFixed(3));
    return `${exact} kg`;
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

/** Trip pack row: one entry per `hiking_trip_pack_id` (products with TRIP_PACK). */
export type TripPacksRowData = {
  /** keyed by hiking trip pack id (`packId` on PackInfo) */
  packs: Map<string, PackInfo>;
};

/**
 * Groups TRIP_PACK hiking products by `hiking_trip_pack_id` for the Packs by Users trip row.
 */
export function groupTripPacksForUsers(hikingProducts: HikingProduct[]): TripPacksRowData {
  const byTrip = new Map<string, HikingProduct[]>();
  for (const p of hikingProducts) {
    if (p.packagingKind !== "TRIP_PACK" || !p.hiking_trip_pack_id) continue;
    const key = p.hiking_trip_pack_id;
    const arr = byTrip.get(key) ?? [];
    arr.push(p);
    byTrip.set(key, arr);
  }

  const packs = new Map<string, PackInfo>();
  for (const [tripPackId, prods] of byTrip) {
    const first = prods[0];
    const ms = first.hiking_trip_pack?.member_slot ?? null;
    const packNumber = typeof ms === "number" && ms > 0 ? ms : 1;
    packs.set(tripPackId, {
      packId: tripPackId,
      packNumber,
      dayNumber: 0,
      totalWeight: calculatePackWeight(prods),
      products: prods.map((p) => ({
        id: p.id,
        name: p.product_name,
        totalQuantity: p.total_quantity,
      })),
      itemCount: prods.length,
      member_slot: ms,
    });
  }

   return { packs };
}

/** Trip row: column (member slot 1…N) → ordered list of hiking trip pack ids in that zone. */
export type TripColumnAssignments = Map<number, string[]>;

/**
 * Builds initial column → pack id lists from server `member_slot` and unassigned packs.
 * Packs with `member_slot` in 1…maxPackNumber are grouped into that column (multiple allowed).
 * Others are placed round-robin across columns.
 */
export function buildBaseTripAssignments(
  tripData: TripPacksRowData,
  maxPackNumber: number,
): TripColumnAssignments {
  const columns = new Map<number, string[]>();
  if (maxPackNumber <= 0) {
    return columns;
  }
  for (let c = 1; c <= maxPackNumber; c += 1) {
    columns.set(c, []);
  }

  const assignedIds = new Set<string>();
  for (const p of tripData.packs.values()) {
    const ms = p.member_slot;
    if (typeof ms === "number" && ms >= 1 && ms <= maxPackNumber) {
      columns.get(ms)!.push(p.packId);
      assignedIds.add(p.packId);
    }
  }

  const unassigned = [...tripData.packs.values()]
    .filter((p) => !assignedIds.has(p.packId))
    .sort((a, b) => a.packNumber - b.packNumber);

  let rr = 0;
  for (const p of unassigned) {
    const col = (rr % maxPackNumber) + 1;
    rr += 1;
    columns.get(col)!.push(p.packId);
  }

  return columns;
}

/** Returns the member column (1-based) that currently contains `packId`, if any. */
export function findTripPackColumn(assignments: TripColumnAssignments, packId: string): number | undefined {
  for (const [col, ids] of assignments) {
    if (ids.includes(packId)) return col;
  }
  return undefined;
}
