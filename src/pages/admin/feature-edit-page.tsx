import { Link, useParams } from "react-router-dom";

export const FeatureEditPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Link to="/admin/features" className="text-muted-foreground text-sm hover:text-foreground hover:underline">
          Back to features
        </Link>
        <h1 className="text-xl font-bold">Edit feature</h1>
        <p className="text-muted-foreground text-sm">Edit feature {id ? `"${id}"` : ""}.</p>
      </div>
      <p className="text-muted-foreground text-sm">The shared feature form will be added here.</p>
    </div>
  );
};
