import { FeaturesList } from "@/components";

export const FeaturesPage = () => (
  <div className="space-y-4">
    <div className="space-y-2">
      <h1 className="text-xl font-bold">Features</h1>
      <p className="text-muted-foreground text-sm">Browse and filter application features.</p>
    </div>
    <FeaturesList />
  </div>
);
