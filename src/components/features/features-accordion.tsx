import { useMemo } from "react";

import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useFeatures } from "@/hooks";
import { cn } from "@/lib/utils";
import type { FeatureLang, FeatureStatus } from "@/types/feature";

export type FeaturesAccordionProps = {
  /** Filter by feature status (default `DONE`). */
  status?: FeatureStatus;
  /** Filter by main-feature flag (default `true`). */
  isMain?: boolean;
  /** Optional language filter passed to `GET /features`. */
  lang?: FeatureLang;
  className?: string;
};

export const FeaturesAccordion = ({ status = "DONE", isMain = true, lang, className }: FeaturesAccordionProps) => {
  const { data, isLoading, isError, error } = useFeatures({
    status,
    lang,
    isMain,
    limit: 100,
  });

  const features = useMemo(() => {
    const rows = data?.data ?? [];
    return rows.filter((f) => f.status === status && f.isMain === isMain);
  }, [data?.data, isMain, status]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return (
      <p className="text-destructive text-sm">
        Failed to load features: {error instanceof Error ? error.message : "Unknown error"}
      </p>
    );
  }

  if (features.length === 0) {
    return <p className="text-muted-foreground text-sm">No features to display.</p>;
  }

  return (
    <Accordion type="multiple" className={cn("w-full rounded-md border bg-muted/30", className)}>
      {features.map((feature) => (
        <AccordionItem key={feature.id} value={feature.id} className="border-border px-3">
          <AccordionTrigger className="py-3 hover:no-underline">
            <span className="flex min-w-0 flex-1 items-center gap-2 pr-2 text-left">
              <span className="min-w-0 flex-1 font-medium">{feature.name}</span>
              <span className="text-muted-foreground shrink-0 text-xs uppercase">{feature.lang}</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-2">
            {feature.description ? <p className="text-muted-foreground">{feature.description}</p> : null}
            {feature.fullText ? (
              <div className="text-muted-foreground whitespace-pre-wrap text-xs leading-relaxed">
                {feature.fullText}
              </div>
            ) : null}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
