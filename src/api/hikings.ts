import { apiFetch } from "@/lib/api-client";
import type {
  AddHikingAdminPayload,
  AddHikingProductPayload,
  CreateHikingDayPackPayload,
  CreateHikingPayload,
  Hiking,
  HikingAdmin,
  HikingProductsFromRecipePayload,
  HikingProductTotalsResponse,
  HikingsListParams,
  HikingsListResponse,
  HikingsMeta,
  HikingWithProducts,
  UpdateHikingDayPackPayload,
} from "@/types/hiking";
import type { HikingDayPack, HikingProduct, UpdateHikingProductPayload } from "@/types/hiking-product";

/** Row as returned by the API (camelCase or snake_case; numeric fields may be strings). */
type HikingApiRow = {
  id: string;
  name?: string;
  user_id?: string;
  daysTotal?: unknown;
  days_total?: unknown;
  membersTotal?: unknown;
  members_total?: unknown;
  vegetariansTotal?: unknown;
  vegetarians_total?: unknown;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
};

const coalesceNumber = (...candidates: unknown[]): number => {
  for (const v of candidates) {
    if (typeof v === "number" && !Number.isNaN(v)) return v;
    if (typeof v === "string" && v.trim() !== "") {
      const n = Number(v);
      if (!Number.isNaN(n)) return n;
    }
  }
  return 0;
};

const normalizeHiking = (row: HikingApiRow): Hiking => ({
  id: String(row.id),
  name: row.name ?? "",
  userId: row.user_id,
  daysTotal: coalesceNumber(row.daysTotal, row.days_total),
  membersTotal: coalesceNumber(row.membersTotal, row.members_total),
  vegetariansTotal: coalesceNumber(row.vegetariansTotal, row.vegetarians_total),
  createdAt: row.createdAt ?? row.created_at,
  updatedAt: row.updatedAt ?? row.updated_at,
});

const normalizeHikingsList = (data: HikingApiRow[] | undefined): Hiking[] => (data ?? []).map(normalizeHiking);

type HikingDetailApiRow = HikingApiRow & {
  hiking_products: HikingProduct[];
  admins: HikingAdmin[];
};

function unwrapHikingDetailResponse(raw: unknown): HikingDetailApiRow {
  if (raw && typeof raw === "object" && "data" in raw && (raw as { data: unknown }).data != null) {
    return (raw as { data: HikingDetailApiRow }).data;
  }
  return raw as HikingDetailApiRow;
}

function normalizeHikingProduct(row: unknown): HikingProduct {
  const r = row as Record<string, unknown>;
  return {
    id: String(r.id ?? ""),
    hiking_id: String(r.hiking_id ?? r.hikingId ?? ""),
    day_number: coalesceNumber(r.day_number, r.dayNumber),
    eating_time_id: String(r.eating_time_id ?? r.eatingTimeId ?? ""),
    eating_time_name: String(r.eating_time_name ?? r.eatingTimeName ?? ""),
    product_id: String(r.product_id ?? r.productId ?? ""),
    product_name: String(r.product_name ?? r.productName ?? ""),
    recipe_id: String(r.recipe_id ?? r.recipeId ?? ""),
    recipe_name: String(r.recipe_name ?? r.recipeName ?? ""),
    personal_quantity: coalesceNumber(r.personal_quantity, r.personalQuantity),
    total_quantity: coalesceNumber(r.total_quantity, r.totalQuantity),
    hiking_day_pack_id: (r.hiking_day_pack_id ?? r.hikingDayPackId ?? null) as string | null,
    hiking_day_pack: normalizeHikingDayPack(r.hiking_day_pack ?? r.hikingDayPack),
  };
}

function normalizeHikingDayPack(row: unknown): HikingDayPack | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  return {
    id: String(r.id ?? ""),
    day_number: coalesceNumber(r.day_number, r.dayNumber),
    pack_number: coalesceNumber(r.pack_number, r.packNumber),
    label: (r.label ?? null) as string | null,
    notes: (r.notes ?? null) as string | null,
  };
}

function normalizeHikingProductsList(raw: unknown): HikingProduct[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(normalizeHikingProduct);
}

const metaFromListLength = (length: number): HikingsMeta => ({
  total: length,
  page: 1,
  limit: length,
  totalPages: length > 0 ? 1 : 0,
});

const hikingsListQueryString = (params: HikingsListParams): string => {
  const sp = new URLSearchParams();
  if (params.page != null) sp.set("page", String(params.page));
  if (params.limit != null) sp.set("limit", String(params.limit));
  const q = params.search?.trim();
  if (q) sp.set("search", q);
  return sp.toString() ? `?${sp.toString()}` : "";
};

export const getHikings = async (params: HikingsListParams = {}): Promise<HikingsListResponse> => {
  const path = `/hikings${hikingsListQueryString(params)}`;
  const raw = await apiFetch<HikingApiRow[] | { data?: HikingApiRow[]; meta?: HikingsMeta }>(path, {
    method: "GET",
  });
  if (Array.isArray(raw)) {
    const data = normalizeHikingsList(raw);
    return { data, meta: metaFromListLength(data.length) };
  }
  const data = normalizeHikingsList(raw.data);
  return {
    data,
    meta: raw.meta ?? metaFromListLength(data.length),
  };
};

/**
 * `GET /hikings/:id` — single hiking with `hiking_products` (snake or camel from API; normalized).
 */
// TODO: Simplify this, check types!
export async function getHiking(id: string): Promise<HikingWithProducts> {
  const path = `/hikings/${encodeURIComponent(id)}`;
  const raw = await apiFetch<unknown>(path, { method: "GET" });
  const row = unwrapHikingDetailResponse(raw);
  const base = normalizeHiking(row);
  const hiking_products = normalizeHikingProductsList(row.hiking_products);
  const admins = row.admins as HikingAdmin[];
  return { ...base, hiking_products, admins };
}

/**
 * `POST /hikings` — create a hiking plan (auth as required by the API).
 */
export async function postHiking(payload: CreateHikingPayload): Promise<unknown> {
  return apiFetch("/hikings", {
    method: "POST",
    body: payload,
  });
}

/**
 * `PATCH /hikings/:hikingId/hiking-products/:hikingProductId` — update personal/total quantity for a hiking product.
 */
export async function patchHikingProduct(
  hikingId: string,
  hikingProductId: string,
  payload: UpdateHikingProductPayload,
): Promise<unknown> {
  return apiFetch(`/hikings/${encodeURIComponent(hikingId)}/hiking-products/${encodeURIComponent(hikingProductId)}`, {
    method: "PATCH",
    body: payload,
  });
}

/**
 * `POST /hikings/:id/admins` — grant admin access to a user for this hiking plan.
 */
export async function postHikingAdmin(hikingId: string, payload: AddHikingAdminPayload): Promise<unknown> {
  return apiFetch(`/hikings/${encodeURIComponent(hikingId)}/admins`, {
    method: "POST",
    body: payload,
  });
}

/**
 * `POST /hikings/:id/hiking-products` — add a single product directly to a hiking plan.
 */
export async function postHikingProduct(hikingId: string, payload: AddHikingProductPayload): Promise<unknown> {
  return apiFetch(`/hikings/${encodeURIComponent(hikingId)}/hiking-products`, {
    method: "POST",
    body: payload,
  });
}

/**
 * `DELETE /hikings/:hikingId/hiking-products/:hikingProductId` — remove a product from a hiking plan.
 */
export async function deleteHikingProduct(hikingId: string, hikingProductId: string): Promise<unknown> {
  return apiFetch(`/hikings/${encodeURIComponent(hikingId)}/hiking-products/${encodeURIComponent(hikingProductId)}`, {
    method: "DELETE",
  });
}

/**
 * `GET /hikings/:id/product-totals` — aggregated grams and line count per product for a hiking plan.
 */
export async function getHikingProductTotals(hikingId: string): Promise<HikingProductTotalsResponse> {
  return apiFetch(`/hikings/${encodeURIComponent(hikingId)}/product-totals`, { method: "GET" });
}

/**
 * `POST /hikings/:id/hiking-products/from-recipe` — add hiking products from a recipe for a day / eating time.
 */
export async function postHikingProductsFromRecipe(
  hikingId: string,
  payload: HikingProductsFromRecipePayload,
): Promise<unknown> {
  return apiFetch(`/hikings/${encodeURIComponent(hikingId)}/hiking-products/from-recipe`, {
    method: "POST",
    body: payload,
  });
}

/**
 * `POST /hikings/:id/packs` — create a new day pack for organizing products.
 */
export async function postHikingDayPack(hikingId: string, payload: CreateHikingDayPackPayload): Promise<HikingDayPack> {
  return apiFetch(`/hikings/${encodeURIComponent(hikingId)}/packs`, {
    method: "POST",
    body: payload,
  });
}

/**
 * `PATCH /hikings/:hikingId/packs/:packId` — update label or notes of a day pack.
 */
export async function patchHikingDayPack(
  hikingId: string,
  packId: string,
  payload: UpdateHikingDayPackPayload,
): Promise<HikingDayPack> {
  return apiFetch(`/hikings/${encodeURIComponent(hikingId)}/packs/${encodeURIComponent(packId)}`, {
    method: "PATCH",
    body: payload,
  });
}

/**
 * `DELETE /hikings/:hikingId/packs/:packId` — delete a day pack.
 */
export async function deleteHikingDayPack(hikingId: string, packId: string): Promise<void> {
  return apiFetch(`/hikings/${encodeURIComponent(hikingId)}/packs/${encodeURIComponent(packId)}`, {
    method: "DELETE",
  });
}
