import { Link, useNavigate } from "react-router-dom";

import { FeatureForm } from "@/components";
import { useCreateFeature } from "@/hooks";
import type { FeatureFormData } from "@/schemas/feature";

const CREATE_FEATURE_DEFAULT_VALUES: FeatureFormData = {
  name: "",
  description: "",
  fullText: "",
  status: "DRAFT",
  isMain: false,
  lang: "EN",
};

export const FeatureCreatePage = () => {
  const navigate = useNavigate();
  const createFeature = useCreateFeature();

  const handleSubmit = (data: FeatureFormData) => {
    createFeature.mutate(data, {
      onSuccess: () => navigate("/admin/features"),
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Link to="/admin/features" className="text-muted-foreground text-sm hover:text-foreground hover:underline">
          Back to features
        </Link>
        <h1 className="text-xl font-bold">New feature</h1>
        <p className="text-muted-foreground text-sm">Create a new application feature.</p>
      </div>

      {createFeature.error ? (
        <p className="text-destructive text-sm">
          Failed to create feature: {createFeature.error instanceof Error ? createFeature.error.message : "Unknown error"}
        </p>
      ) : null}

      <FeatureForm
        defaultValues={CREATE_FEATURE_DEFAULT_VALUES}
        onSubmit={handleSubmit}
        isSaving={createFeature.isPending}
        submitLabel="Create feature"
        formId="create-feature-form"
      />
    </div>
  );
};
