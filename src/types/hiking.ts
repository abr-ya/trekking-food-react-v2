import type { HikingProduct } from "./hiking-product";

export type CreateHikingPayload = {
  name: string;
  daysTotal: number;
  membersTotal: number;
  vegetariansTotal: number;
};

export type Hiking = CreateHikingPayload & {
  id: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
};

/** Admin entry as returned by `GET /hikings/:id`. */
export type HikingAdmin = {
  id: string;
  name: string;
  email?: string;
  image?: string;
};

export type HikingWithProducts = Hiking & {
  hiking_products: HikingProduct[];
  admins: HikingAdmin[];
};

export type HikingDayPack = {
  id: string;
  day_number: number;
  pack_number: number;
  member_slot: number | null;
};

export type HikingDayPackSummary = {
  id: string;
  day_number: number;
  pack_number: number;
  member_slot: number | null;
};

export type HikingDetail = Hiking & {
  hiking_products: HikingProduct[];
  admins: HikingAdmin[];
  day_packs: HikingDayPackSummary[];
};

export type HikingsMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type HikingsListResponse = {
  data: Hiking[];
  meta: HikingsMeta;
};

export type HikingsListParams = {
  page?: number;
  limit?: number;
  search?: string;
};

/** Body for `POST /hikings/:id/hiking-products/from-recipe`. */
export type HikingProductsFromRecipePayload = {
  recipeId: string;
  dayNumber: number;
  eatingTimeId: string;
};

/** Body for `POST /hikings/:id/hiking-products`. */
export type AddHikingProductPayload = {
  dayNumber: number;
  eatingTimeId: string;
  productId: string;
  personalQuantity: number;
  totalQuantity?: number;
  recipeId: string | null;
};

/** Body for `POST /hikings/:id/admins`. */
export type AddHikingAdminPayload = {
  userId: string;
};

/** Body for `POST /hikings/:id/packs/:packId/hiking-products`. */
export type AssignHikingProductsToPackPayload = {
  hikingProductIds: string[];
};

/** Body for `POST /hikings/:id/packs`. */
export type CreateHikingDayPackPayload = {
  dayNumber: number;
  packNumber: number;
  label?: string | null;
  notes?: string | null;
};

/** Body for `PATCH /hikings/:hikingId/packs/:packId`. */
export type UpdateHikingDayPackPayload = {
  label?: string | null;
  notes?: string | null;
};

export type HikingProductTotal = {
  productId: string;
  productName: string;
  totalGrams: number;
  lineCount: number;
};

export type HikingProductTotalsResponse = {
  items: HikingProductTotal[];
};
