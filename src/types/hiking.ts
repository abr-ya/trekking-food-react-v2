import type { HikingDayPackSummary, HikingProduct } from "./hiking-product";

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

/** Trip pack entry — product assigned to a specific pack number and member slot. */
export type TripPack = {
  id: string;
  product_id: string;
  pack_number: number;
  member_slot: number;
};

export type HikingWithProducts = Hiking & {
  hiking_products: HikingProduct[];
  admins: HikingAdmin[];
};

export type HikingDetail = Hiking & {
  hiking_products: HikingProduct[];
  admins: HikingAdmin[];
  day_packs: HikingDayPackSummary[];
  day_comments: HikingDayComment[];
  trip_packs: TripPack[];
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

/** Day comment as returned inside hiking detail `day_comments`. */
export type HikingDayComment = {
  day_number: number;
  comment: string;
};

/** Body for `POST /hikings/:id/day-comments`. */
export type CreateHikingDayCommentPayload = {
  dayNumber: number;
  comment: string;
};

/** Body for `PATCH /hikings/:id/day-comments/:dayNumber`. */
export type UpdateHikingDayCommentPayload = {
  comment: string;
};

/** Body for `POST /hikings/:id/packs/auto-distribute`. */
export type AutoDistributePacksPayload = {
  dayNumber: number;
};

/** Body for `POST /hikings/:id/hiking-products/promote-to-trip-pack`. */
export type AddTripPackPayload = {
  productId: string;
  packCount?: number;
};

/** Body for `POST /hikings/:id/trip-packs/member-slots` — bulk update HikingTripPack member slots. */
export type TripPackMemberSlotsPayload = {
  assignments: { packId: string; memberSlot: number | null }[];
};
