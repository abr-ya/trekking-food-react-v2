import { useId } from "react";
import { Controller, type ControllerRenderProps, type FieldValues, type Path, useFormContext } from "react-hook-form";
import Select from "react-select";
import type { SingleValue } from "react-select";
import type { FieldError } from "react-hook-form";

import { Field, FieldError as UIFieldError, FieldLabel } from "@/components/ui/field-cursor";
import { useSelectStyles } from "@/components/common/use-select-styles";
import type { SelectWithSearchOption } from "@/components/common/select-with-search";

type InnerProps = {
  field: ControllerRenderProps<FieldValues, string>;
  error: FieldError | undefined;
  options: SelectWithSearchOption[];
  label?: string;
  placeholder?: string;
  inputId: string;
};

const StaticSelectInner = ({ field, error, options, label, placeholder, inputId }: InnerProps) => {
  const styles = useSelectStyles(Boolean(error?.message));
  const selected = options.find((o) => o.value === field.value) ?? null;

  return (
    <Field>
      {label ? <FieldLabel htmlFor={inputId}>{label}</FieldLabel> : null}
      <Select<SelectWithSearchOption>
        inputId={inputId}
        options={options}
        value={selected}
        onChange={(opt: SingleValue<SelectWithSearchOption>) => field.onChange(opt?.value ?? "")}
        placeholder={placeholder}
        isClearable
        menuPortalTarget={document.body}
        menuPosition="fixed"
        styles={{ ...styles, menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        classNamePrefix="rhf-static-select"
      />
      {error?.message ? <UIFieldError>{error.message}</UIFieldError> : null}
    </Field>
  );
};

type RHFStaticSelectProps<F extends FieldValues> = {
  name: Path<F>;
  label?: string;
  placeholder?: string;
  options: SelectWithSearchOption[];
};

/**
 * Single-select backed by a static options list (no async fetch).
 * Renders the menu via `menuPortalTarget` so it works inside Radix Dialog
 * without focus-trap conflicts.
 */
export function RHFStaticSelect<F extends FieldValues>({ name, label, placeholder, options }: RHFStaticSelectProps<F>) {
  const { control } = useFormContext<F>();
  const inputId = useId();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <StaticSelectInner
          field={field as ControllerRenderProps<FieldValues, string>}
          error={error as FieldError | undefined}
          options={options}
          label={label}
          placeholder={placeholder}
          inputId={inputId}
        />
      )}
    />
  );
}
