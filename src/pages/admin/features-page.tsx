import { Link } from "react-router-dom";

import { FeaturesList } from "@/components";
import { Button } from "@/components/ui/button";

export const FeaturesPage = () => (
  <div className="space-y-4">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="space-y-2">
        <h1 className="text-xl font-bold">Features</h1>
        <p className="text-muted-foreground text-sm">Browse and filter application features.</p>
      </div>
      <Button asChild size="sm">
        <Link to="/admin/features/new">New feature</Link>
      </Button>
    </div>
    <FeaturesList />
  </div>
);
