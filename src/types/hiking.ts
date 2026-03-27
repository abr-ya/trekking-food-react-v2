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

/** Body for `POST /hikings/:id/admins`. */
export type AddHikingAdminPayload = {
  userId: string;
};
