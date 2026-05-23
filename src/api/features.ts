import { apiFetch } from "@/lib/api-client";
import type {
  CreateFeaturePayload,
  Feature,
  FeatureApiRow,
  FeaturesListParams,
  FeaturesListResponse,
  FeaturesMeta,
} from "@/types/feature";

function normalizeFeature(row: FeatureApiRow): Feature {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    fullText: row.full_text,
    status: row.status,
    lang: row.lang,
    isMain: row.is_main,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function metaFromListLength(length: number): FeaturesMeta {
  return {
    total: length,
    page: 1,
    limit: length,
    totalPages: length > 0 ? 1 : 0,
  };
}

function featuresListQueryString(params: FeaturesListParams): string {
  const sp = new URLSearchParams();
  if (params.page != null) sp.set("page", String(params.page));
  if (params.limit != null) sp.set("limit", String(params.limit));
  if (params.status != null) sp.set("status", params.status);
  if (params.lang != null) sp.set("lang", params.lang);
  if (params.isMain != null) sp.set("is_main", String(params.isMain));
  const s = sp.toString();
  return s ? `?${s}` : "";
}

type RawFeaturesListResponse = { data: FeatureApiRow[]; meta?: FeaturesMeta };

/**
 * `GET /features` — list features with pagination meta. Plain arrays are normalized to `{ data, meta }`.
 */
export async function getFeatures(params: FeaturesListParams = {}): Promise<FeaturesListResponse> {
  const path = `/features${featuresListQueryString(params)}`;
  const raw = await apiFetch<FeatureApiRow[] | RawFeaturesListResponse>(path, { method: "GET" });
  if (Array.isArray(raw)) {
    const data = raw.map(normalizeFeature);
    return { data, meta: metaFromListLength(data.length) };
  }
  const data = (raw.data ?? []).map(normalizeFeature);
  return {
    data,
    meta: raw.meta ?? metaFromListLength(data.length),
  };
}

/**
 * `POST /features` — create a feature. Request body uses camelCase (`fullText`, `isMain`, …).
 */
export async function postFeature(payload: CreateFeaturePayload): Promise<Feature> {
  const raw = await apiFetch<FeatureApiRow>("/features", {
    method: "POST",
    body: payload,
  });
  return normalizeFeature(raw);
}
