import { useId } from "react";
import { Controller, type FieldValues, type Path, useFormContext } from "react-hook-form";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field-cursor";

export type RHFSelectOption = { label: string; value: string };

type RHFSelectProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  options: readonly RHFSelectOption[];
  placeholder?: string;
  helpText?: string;
};

export function RHFSelect<T extends FieldValues>({
  name,
  label,
  options,
  placeholder = "Select…",
  helpText,
}: RHFSelectProps<T>) {
  const { control } = useFormContext();
  const inputId = useId();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const selected = options.find((o) => o.value === field.value) ?? null;

        return (
          <Field>
            <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
            <Combobox<RHFSelectOption>
              items={[...options]}
              value={selected}
              onValueChange={(item) => field.onChange(item == null ? "" : item.value)}
              isItemEqualToValue={(a, b) => a.value === b.value}
            >
              <ComboboxInput id={inputId} placeholder={placeholder} />
              <ComboboxContent>
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                  {(item: RHFSelectOption) => (
                    <ComboboxItem key={item.value} value={item}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            {!error?.message && helpText ? <FieldDescription>{helpText}</FieldDescription> : null}
            {error?.message ? <FieldError>{error.message}</FieldError> : null}
          </Field>
        );
      }}
    />
  );
}
