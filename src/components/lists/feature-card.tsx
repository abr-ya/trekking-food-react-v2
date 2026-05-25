import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Feature } from "@/types/feature";
import { cn } from "@/lib/utils";

type FeatureCardProps = {
  feature: Feature;
};

const statusLabel: Record<Feature["status"], string> = {
  DRAFT: "Draft",
  TODO: "To do",
  IN_PROGRESS: "In progress",
  IN_TEST: "In test",
  DONE: "Done",
};

export const FeatureCard = ({ feature }: FeatureCardProps) => (
  <Card className="py-3 px-4">
    <CardContent className="space-y-2 p-0">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <Link
          to={`/admin/features/${encodeURIComponent(feature.id)}`}
          className="min-w-0 flex-1 font-medium hover:underline"
        >
          {feature.name}
        </Link>
        <div className="flex shrink-0 flex-wrap items-center gap-1.5">
          {feature.isMain ? (
            <span className="bg-primary/15 text-primary rounded px-1.5 py-0.5 text-xs font-medium">Main</span>
          ) : null}
          <span className="text-muted-foreground rounded border px-1.5 py-0.5 text-xs uppercase">{feature.lang}</span>
          <span
            className={cn(
              "rounded px-1.5 py-0.5 text-xs font-medium",
              feature.status === "DONE" && "bg-green-500/15 text-green-700 dark:text-green-400",
              feature.status === "IN_PROGRESS" && "bg-blue-500/15 text-blue-700 dark:text-blue-400",
              feature.status !== "DONE" && feature.status !== "IN_PROGRESS" && "bg-muted text-muted-foreground",
            )}
          >
            {statusLabel[feature.status]}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-2">
        {feature.description ? (
          <p className="text-muted-foreground line-clamp-2 min-w-0 flex-1 text-sm">{feature.description}</p>
        ) : (
          <span />
        )}
        <Button asChild variant="outline" size="sm">
          <Link to={`/admin/features/${encodeURIComponent(feature.id)}/edit`}>Edit</Link>
        </Button>
      </div>
    </CardContent>
  </Card>
);
