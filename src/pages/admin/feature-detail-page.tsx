import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";

export const FeatureDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const editPath = id ? `/admin/features/${encodeURIComponent(id)}/edit` : "/admin/features";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <Link to="/admin/features" className="text-muted-foreground text-sm hover:text-foreground hover:underline">
            Back to features
          </Link>
          <h1 className="text-xl font-bold">Feature details</h1>
          <p className="text-muted-foreground text-sm">View feature {id ? `"${id}"` : ""}.</p>
        </div>
        {id ? (
          <Button asChild size="sm" variant="outline">
            <Link to={editPath}>Edit</Link>
          </Button>
        ) : null}
      </div>
      <p className="text-muted-foreground text-sm">Feature details will be loaded here.</p>
    </div>
  );
};
