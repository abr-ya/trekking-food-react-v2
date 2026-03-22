import { apiFetch } from "@/lib/api-client";
import type {
  CreateHikingPayload,
  Hiking,
  HikingsListParams,
  HikingsListResponse,
  HikingsMeta,
} from "@/types/hiking";

/** Row as returned by the API (camelCase or snake_case; numeric fields may be strings). */
type HikingApiRow = {
  id: string;
  name?: string;
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

function coalesceNumber(...candidates: unknown[]): number {
  for (const v of candidates) {
    if (typeof v === "number" && !Number.isNaN(v)) return v;
    if (typeof v === "string" && v.trim() !== "") {
      const n = Number(v);
      if (!Number.isNaN(n)) return n;
    }
  }
  return 0;
}

function normalizeHiking(row: HikingApiRow): Hiking {
  return {
    id: String(row.id),
    name: row.name ?? "",
    daysTotal: coalesceNumber(row.daysTotal, row.days_total),
    membersTotal: coalesceNumber(row.membersTotal, row.members_total),
    vegetariansTotal: coalesceNumber(row.vegetariansTotal, row.vegetarians_total),
    createdAt: row.createdAt ?? row.created_at,
    updatedAt: row.updatedAt ?? row.updated_at,
  };
}

function normalizeHikingsList(data: HikingApiRow[] | undefined): Hiking[] {
  return (data ?? []).map(normalizeHiking);
}

function metaFromListLength(length: number): HikingsMeta {
  return {
    total: length,
    page: 1,
    limit: length,
    totalPages: length > 0 ? 1 : 0,
  };
}

function hikingsListQueryString(params: HikingsListParams): string {
  const sp = new URLSearchParams();
  if (params.page != null) sp.set("page", String(params.page));
  if (params.limit != null) sp.set("limit", String(params.limit));
  const q = params.search?.trim();
  if (q) sp.set("search", q);
  const s = sp.toString();
  return s ? `?${s}` : "";
}

/**
 * `GET /hikings` — paginated list, optional `search`. Expects `{ data, meta }`; plain arrays are normalized.
 */
export async function getHikings(params: HikingsListParams = {}): Promise<HikingsListResponse> {
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
