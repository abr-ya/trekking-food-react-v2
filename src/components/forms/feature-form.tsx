import { FormProvider, useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { MarkdownContent } from "@/components/common/markdown-content";
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
    register,
  } = form;
  const fullText = useWatch({ control: form.control, name: "fullText" }) ?? "";
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

          <Field>
            <FieldLabel htmlFor={`${formId}-full-text`}>Full text</FieldLabel>
            <textarea
              id={`${formId}-full-text`}
              rows={12}
              {...register("fullText")}
              className={cn(inputClassName, "min-h-72 py-2 font-mono", errors.fullText && "border-destructive")}
              placeholder="## Trip packs&#10;&#10;Markdown body..."
              aria-invalid={Boolean(errors.fullText)}
            />
            {!errors.fullText ? <FieldDescription>Markdown body shown on public and admin detail views.</FieldDescription> : null}
            {errors.fullText?.message ? <FieldError>{errors.fullText.message}</FieldError> : null}
          </Field>

          <div className="grid gap-2 rounded-md border bg-muted/30 p-3">
            <p className="text-sm font-medium">Preview</p>
            {fullText.trim() ? (
              <MarkdownContent source={fullText} />
            ) : (
              <p className="text-muted-foreground text-sm">Markdown preview will appear here.</p>
            )}
          </div>
        </fieldset>

        <Button type="submit" disabled={isDisabled} className="w-fit">
          {isDisabled ? "Saving..." : submitLabel}
        </Button>
      </form>
    </FormProvider>
  );
};
