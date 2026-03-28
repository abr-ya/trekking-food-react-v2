import { useId, type ComponentProps, type SyntheticEvent } from "react";
import { Controller, type FieldValues, type Path, useFormContext } from "react-hook-form";
import { withMask } from "use-mask-input";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field-cursor";
import { Input } from "@/components/ui/input-cursor";
import { mergeRefs } from "@/lib/merge-refs";
import { cn } from "@/lib/utils";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  helpText?: string;
  /** Masked digit input (e.g. small integers). Mutually exclusive with `valueAsNumber`. */
  isNumber?: boolean;
  /** Coerce to number for Zod `z.number()` fields; use with `type="number"` and optional `step`. */
  valueAsNumber?: boolean;
} & ComponentProps<"input">;

export function RHFInput<T extends FieldValues>({
  name,
  label,
  helpText,
  isNumber,
  valueAsNumber,
  id: idProp,
  className,
  ...props
}: Props<T>) {
  const { control } = useFormContext();
  const maskRef = isNumber && !valueAsNumber ? withMask("9[99]") : undefined;
  const autoId = useId();
  const inputId = idProp ?? autoId;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const changeHandler = (e: SyntheticEvent) => {
          const el = e.target as HTMLInputElement;
          if (valueAsNumber) {
            const raw = el.value;
            if (raw === "") {
              field.onChange(0);
              return;
            }
            const n = Number(raw);
            field.onChange(Number.isNaN(n) ? 0 : n);
            return;
          }
          const value = el.value.replace("_", "");
          field.onChange(isNumber && value ? Number(value) : value);
        };

        const { ref: fieldRef, ...fieldRest } = field;

        const displayValue = valueAsNumber
          ? field.value === undefined || field.value === null || Number.isNaN(field.value as number)
            ? ""
            : field.value
          : (field.value ?? "");

        return (
          <Field>
            <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
            <Input
              {...props}
              {...fieldRest}
              id={inputId}
              ref={mergeRefs(fieldRef, maskRef)}
              value={displayValue as string | number}
              onChange={changeHandler}
              aria-invalid={!!error || !!props["aria-invalid"]}
              className={cn(error && "border-destructive", className)}
            />
            {!error?.message && helpText ? <FieldDescription>{helpText}</FieldDescription> : null}
            {error?.message ? <FieldError>{error.message}</FieldError> : null}
          </Field>
        );
      }}
    />
  );
}
