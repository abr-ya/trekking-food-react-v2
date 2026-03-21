import { useId, type ComponentProps, type SyntheticEvent } from "react";
import { Controller, type FieldValues, type Path, useFormContext } from "react-hook-form";
import { withMask } from "use-mask-input";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field-cursor";
import { Input } from "@/components/ui/input-corsor";
import { mergeRefs } from "@/lib/merge-refs";
import { cn } from "@/lib/utils";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  helpText?: string;
  isNumber?: boolean;
} & ComponentProps<"input">;

export function RHFInput<T extends FieldValues>({
  name,
  label,
  helpText,
  isNumber,
  id: idProp,
  className,
  ...props
}: Props<T>) {
  const { control } = useFormContext();
  const maskRef = isNumber ? withMask("9[99]") : undefined;
  const autoId = useId();
  const inputId = idProp ?? autoId;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const changeHandler = (e: SyntheticEvent) => {
          const value = (e.target as HTMLInputElement).value.replace("_", "");
          field.onChange(isNumber && value ? Number(value) : value);
        };

        const { ref: fieldRef, ...fieldRest } = field;

        return (
          <Field>
            <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
            <Input
              {...props}
              {...fieldRest}
              id={inputId}
              ref={mergeRefs(fieldRef, maskRef)}
              value={field.value ?? ""}
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
