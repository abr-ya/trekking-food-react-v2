import { useMemo } from "react";
import { Controller, type FieldValues, type Path, useFormContext } from "react-hook-form";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

export type RHFSelectOption = { label: string; value: string };

type RHFSelectProps<T extends FieldValues> = {
  name: Path<T>;
  options: readonly RHFSelectOption[];
  placeholder?: string;
};

export function RHFSelect<T extends FieldValues>({ name, options, placeholder = "Select…" }: RHFSelectProps<T>) {
  const { control } = useFormContext();

  const itemValues = useMemo(() => options.map((o) => o.value), [options]);

  const labelByValue = useMemo(() => {
    const m = new Map<string, string>();
    for (const o of options) {
      m.set(o.value, o.label);
    }
    return m;
  }, [options]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Combobox items={itemValues} value={field.value ?? null} onValueChange={(v) => field.onChange(v ?? "")}>
          <ComboboxInput placeholder={placeholder} />
          <ComboboxContent>
            <ComboboxEmpty>No items found.</ComboboxEmpty>
            <ComboboxList>
              {(value: string) => (
                <ComboboxItem key={value} value={value}>
                  {labelByValue.get(value) ?? value}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      )}
    />
  );
}
