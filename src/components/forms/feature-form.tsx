import { Controller, FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { MarkdownEditor } from "@/components/common/markdown-editor";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field-cursor";
import { inputClassName } from "@/components/ui/input-cursor";
import { cn } from "@/lib/utils";
import { featureFormSchema, type FeatureFormData } from "@/schemas/feature";
import { FEATURE_LANGS, FEATURE_STATUSES } from "@/types/feature";

import { RHFInput, RHFSelect, type RHFSelectOption } from "../rhf";

const STATUS_OPTIONS: readonly RHFSelectOption[] = FEATURE_STATUSES.map((status) => ({
  label: status.replace(/_/g, " "),
  value: status,
}));

const LANG_OPTIONS: readonly RHFSelectOption[] = FEATURE_LANGS.map((lang) => ({
  label: lang,
  value: lang,
}));

export type FeatureFormProps = {
  defaultValues: FeatureFormData;
  onSubmit: SubmitHandler<FeatureFormData>;
  isSaving?: boolean;
  submitLabel: string;
  formId?: string;
};

export const FeatureForm = ({
  defaultValues,
  onSubmit,
  isSaving = false,
  submitLabel,
  formId = "feature-form",
}: FeatureFormProps) => {
  const form = useForm<FeatureFormData>({
    resolver: zodResolver(featureFormSchema),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const {
    formState: { errors, isSubmitting },
    control,
    register,
  } = form;
  const isDisabled = isSaving || isSubmitting;

  return (
    <FormProvider {...form}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="grid max-w-3xl gap-4">
        <fieldset disabled={isDisabled} className="contents">
          <RHFInput<FeatureFormData> name="name" label="Name" helpText="Feature title shown in lists." />

          <Field>
            <FieldLabel htmlFor={`${formId}-description`}>Description</FieldLabel>
            <textarea
              id={`${formId}-description`}
              rows={3}
              {...register("description")}
              className={cn(inputClassName, "min-h-20 py-2", errors.description && "border-destructive")}
              placeholder="Short summary"
              aria-invalid={Boolean(errors.description)}
            />
            {!errors.description ? <FieldDescription>Short plain-text summary.</FieldDescription> : null}
            {errors.description?.message ? <FieldError>{errors.description.message}</FieldError> : null}
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <RHFSelect<FeatureFormData>
              name="status"
              label="Status"
              options={STATUS_OPTIONS}
              placeholder="Select status"
            />
            <RHFSelect<FeatureFormData> name="lang" label="Language" options={LANG_OPTIONS} placeholder="Select lang" />
            <label className="flex cursor-pointer items-center gap-2 self-end pb-2">
              <input type="checkbox" {...register("isMain")} className="size-4 rounded border-input" />
              <span className="text-sm font-medium">Main feature</span>
            </label>
          </div>

          <Controller
            name="fullText"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Field>
                <FieldLabel>Full text</FieldLabel>
                <MarkdownEditor
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  readOnly={isDisabled}
                  placeholder="Start writing feature details..."
                  aria-invalid={Boolean(error)}
                />
                {!error ? (
                  <FieldDescription>Markdown body shown on public and admin detail views.</FieldDescription>
                ) : null}
                {error?.message ? <FieldError>{error.message}</FieldError> : null}
              </Field>
            )}
          />
        </fieldset>

        <Button type="submit" disabled={isDisabled} className="w-fit">
          {isDisabled ? "Saving..." : submitLabel}
        </Button>
      </form>
    </FormProvider>
  );
};
