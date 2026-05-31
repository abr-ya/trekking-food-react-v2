import { Link, useNavigate, useParams } from "react-router-dom";

import { FeatureForm, Skeleton } from "@/components";
import { useFeature, useUpdateFeature } from "@/hooks";
import type { FeatureFormData } from "@/schemas/feature";

export const FeatureEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: feature, isLoading, error } = useFeature(id);
  const updateFeature = useUpdateFeature();

  const handleSubmit = (data: FeatureFormData) => {
    if (!id) return;

    updateFeature.mutate(
      { id, payload: data },
      {
        onSuccess: () => navigate("/admin/features"),
      },
    );
  };

  const defaultValues: FeatureFormData | undefined = feature
    ? {
        name: feature.name,
        description: feature.description,
        fullText: feature.fullText,
        status: feature.status,
        isMain: feature.isMain,
        lang: feature.lang,
      }
    : undefined;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Link to="/admin/features" className="text-muted-foreground text-sm hover:text-foreground hover:underline">
          Back to features
        </Link>
        <h1 className="text-xl font-bold">Edit feature</h1>
        <p className="text-muted-foreground text-sm">Edit feature {id ? `"${id}"` : ""}.</p>
      </div>

      {!id ? <p className="text-destructive text-sm">Feature id is missing.</p> : null}

      {error ? (
        <p className="text-destructive text-sm">
          Failed to load feature: {error instanceof Error ? error.message : "Unknown error"}
        </p>
      ) : null}

      {updateFeature.error ? (
        <p className="text-destructive text-sm">
          Failed to update feature:{" "}
          {updateFeature.error instanceof Error ? updateFeature.error.message : "Unknown error"}
        </p>
      ) : null}

      {isLoading ? (
        <div className="grid max-w-3xl gap-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      ) : defaultValues ? (
        <FeatureForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isSaving={updateFeature.isPending}
          submitLabel="Save changes"
          formId="edit-feature-form"
        />
      ) : null}
    </div>
  );
};
