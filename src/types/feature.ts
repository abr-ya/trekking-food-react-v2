/** Feature lifecycle status (`GET /features`, filter `status`). */
export type FeatureStatus = "DRAFT" | "TODO" | "IN_PROGRESS" | "IN_TEST" | "DONE";

export const FEATURE_STATUSES: FeatureStatus[] = ["DRAFT", "TODO", "IN_PROGRESS", "IN_TEST", "DONE"];

/** Feature content language (`GET /features`, filter `lang`). */
export type FeatureLang = "EN" | "RU";

export const FEATURE_LANGS: FeatureLang[] = ["EN", "RU"];

export type Feature = {
  id: string;
  name: string;
  description: string;
  fullText: string;
  status: FeatureStatus;
  lang: FeatureLang;
  isMain: boolean;
  createdAt: string;
  updatedAt: string;
};

/** Raw row from `GET /features` (snake_case). */
export type FeatureApiRow = {
  id: string;
  name: string;
  description: string;
  full_text: string;
  status: FeatureStatus;
  lang: FeatureLang;
  is_main: boolean;
  created_at: string;
  updated_at: string;
};

export type FeaturesMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type FeaturesListResponse = {
  data: Feature[];
  meta: FeaturesMeta;
};

/** Query params for `GET /features`. */
export type FeaturesListParams = {
  page?: number;
  limit?: number;
  status?: FeatureStatus;
  lang?: FeatureLang;
  isMain?: boolean;
};
