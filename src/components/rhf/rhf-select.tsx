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

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const selected = options.find((o) => o.value === field.value) ?? null;

        return (
          <Combobox<RHFSelectOption>
            items={[...options]}
            value={selected}
            onValueChange={(item) => field.onChange(item == null ? "" : item.value)}
            isItemEqualToValue={(a, b) => a.value === b.value}
          >
            <ComboboxInput placeholder={placeholder} />
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
        );
      }}
    />
  );
}
