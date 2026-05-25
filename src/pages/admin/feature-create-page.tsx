import { Link } from "react-router-dom";

export const FeatureCreatePage = () => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Link to="/admin/features" className="text-muted-foreground text-sm hover:text-foreground hover:underline">
        Back to features
      </Link>
      <h1 className="text-xl font-bold">New feature</h1>
      <p className="text-muted-foreground text-sm">Create a new application feature.</p>
    </div>
    <p className="text-muted-foreground text-sm">The shared feature form will be added here.</p>
  </div>
);
