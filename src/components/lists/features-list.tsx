import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import { Pagination, Skeleton } from "@/components";
import { RHFSelect, type RHFSelectOption } from "@/components/rhf";
import { useFeatures } from "@/hooks";
import type { FeatureLang, FeatureStatus, FeaturesListParams } from "@/types/feature";
import { FEATURE_LANGS, FEATURE_STATUSES } from "@/types/feature";

import { FeatureCard } from "./feature-card";

const FEATURES_PAGE_SIZE = 20;

type MainFilter = "all" | "main" | "non-main";

type FeaturesFiltersForm = {
  status: string;
  lang: string;
  mainFilter: MainFilter;
};

const STATUS_OPTIONS: readonly RHFSelectOption[] = [
  { label: "All statuses", value: "" },
  ...FEATURE_STATUSES.map((s) => ({ label: s.replace(/_/g, " "), value: s })),
];

const LANG_OPTIONS: readonly RHFSelectOption[] = [
  { label: "All languages", value: "" },
  ...FEATURE_LANGS.map((l) => ({ label: l, value: l })),
];

const MAIN_FILTER_OPTIONS: readonly RHFSelectOption[] = [
  { label: "All", value: "all" },
  { label: "Main only", value: "main" },
  { label: "Non-main only", value: "non-main" },
];

const mainFilterToParam = (value: MainFilter): Pick<FeaturesListParams, "isMain"> | undefined => {
  if (value === "main") return { isMain: true };
  if (value === "non-main") return { isMain: false };
  return undefined;
};

const FeaturesListFilters = () => (
  <div className="grid gap-3 sm:grid-cols-3">
    <RHFSelect<FeaturesFiltersForm>
      name="status"
      label="Status"
      options={STATUS_OPTIONS}
      placeholder="All statuses"
    />
    <RHFSelect<FeaturesFiltersForm> name="lang" label="Language" options={LANG_OPTIONS} placeholder="All languages" />
    <RHFSelect<FeaturesFiltersForm>
      name="mainFilter"
      label="Main feature"
      options={MAIN_FILTER_OPTIONS}
      placeholder="All"
    />
  </div>
);

const FeaturesListBody = () => {
  const [page, setPage] = useState(1);
  const status = useWatch<FeaturesFiltersForm, "status">({ name: "status" });
  const lang = useWatch<FeaturesFiltersForm, "lang">({ name: "lang" });
  const mainFilter = useWatch<FeaturesFiltersForm, "mainFilter">({ name: "mainFilter" });

  useEffect(() => {
    setPage(1);
  }, [status, lang, mainFilter]);

  const params = useMemo<FeaturesListParams>(() => {
    const statusFilter = status as FeatureStatus | "";
    const langFilter = lang as FeatureLang | "";
    return {
      page,
      limit: FEATURES_PAGE_SIZE,
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(langFilter ? { lang: langFilter } : {}),
      ...mainFilterToParam(mainFilter ?? "all"),
    };
  }, [lang, mainFilter, page, status]);

  const { data, isLoading, isFetching, error, isPlaceholderData } = useFeatures(params);
  const features = data?.data;
  const meta = data?.meta;
  const showFetchOverlay = isFetching && !isLoading;

  return (
    <>
      <FeaturesListFilters />

      <div className="relative mt-3 min-h-[12rem] max-h-[54vh] overflow-y-auto pr-1">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : error ? (
          <p className="text-destructive text-sm">
            Failed to load features: {error instanceof Error ? error.message : "Unknown error"}
          </p>
        ) : !features?.length && !isPlaceholderData ? (
          <p className="text-muted-foreground text-sm">No features match the selected filters.</p>
        ) : (
          <>
            {features?.length ? (
              <ul className="m-0 list-none space-y-2 p-0">
                {features.map((feature) => (
                  <li key={feature.id}>
                    <FeatureCard feature={feature} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">No features on this page.</p>
            )}
            {showFetchOverlay ? (
              <div
                className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-background/55 backdrop-blur-[1px]"
                aria-hidden
              >
                <Loader2 className="size-8 shrink-0 animate-spin text-muted-foreground" aria-label="Loading" />
              </div>
            ) : null}
          </>
        )}
      </div>

      {meta != null && meta.totalPages <= 1 && (
        <p className="text-muted-foreground text-xs">
          {meta.total} {meta.total === 1 ? "feature" : "features"}
          {meta.limit ? ` · ${meta.limit} per page` : null}
        </p>
      )}

      {meta != null && meta.totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={meta.totalPages}
          onPageChange={setPage}
          disabled={isFetching}
          totalItems={meta.total}
        />
      )}
    </>
  );
};

export const FeaturesList = () => {
  const form = useForm<FeaturesFiltersForm>({
    defaultValues: {
      status: "",
      lang: "",
      mainFilter: "all",
    },
  });

  return (
    <FormProvider {...form}>
      <div className="space-y-3">
        <FeaturesListBody />
      </div>
    </FormProvider>
  );
};
