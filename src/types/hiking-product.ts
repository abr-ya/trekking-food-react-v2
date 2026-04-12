// This file defines types related to hiking products, which are meals or items associated with specific days and packs during a hiking trip. These types are used throughout the application to ensure type safety when working with hiking products.
export interface HikingDayPackSummary {
  id: string;
  day_number: number;
  pack_number: number;
  member_slot: number | null;
}

/** Hiking Day Pack — logical grouping of products for a specific day. */
export interface HikingDayPack extends HikingDayPackSummary {
  label: string | null;
  notes: string | null;
}

/** Row from hiking products API (meal lines for a day / slot). */
export interface HikingProduct {
  id: string;
  hiking_id: string;
  day_number: number;
  eating_time_id: string;
  eating_time_name: string;
  product_id: string;
  product_name: string;
  recipe_id: string;
  recipe_name: string;
  personal_quantity: number;
  total_quantity: number;
  hiking_day_pack_id: string | null;
  hiking_day_pack?: HikingDayPack | null;
}

/** Body for `PATCH /hikings/:hikingId/hiking-products/:hikingProductId`. */
export interface UpdateHikingProductPayload {
  personalQuantity?: number;
  totalQuantity?: number;
}
