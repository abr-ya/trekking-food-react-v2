import { Controller, type FieldValues, type Path, useFormContext } from "react-hook-form";
import type { SingleValue } from "react-select";

import { SelectWithSearch, type SelectWithSearchOption } from "@/components/common/select-with-search";

type RHFSelectWithSearchProps<T, F extends FieldValues> = {
  name: Path<F>;
  label?: string;
  placeholder?: string;
  searchRequest: (query: string) => Promise<T[]>;
  mapFunc: (el: T) => SelectWithSearchOption;
  minForSearch?: number;
};

/**
 * React Hook Form wrapper for SelectWithSearch.
 * Stores the full `SelectWithSearchOption | null` as the field value so the
 * selected label is preserved without needing to re-fetch options.
 * Extract `.value` (the ID) in the submit handler when building the payload.
 */
export function RHFSelectWithSearch<T, F extends FieldValues>({
  name,
  label,
  placeholder,
  searchRequest,
  mapFunc,
  minForSearch,
}: RHFSelectWithSearchProps<T, F>) {
  const { control } = useFormContext<F>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const value = (field.value as SingleValue<SelectWithSearchOption>) ?? null;

        return (
          <SelectWithSearch<T>
            label={label}
            placeholder={placeholder}
            searchRequest={searchRequest}
            mapFunc={mapFunc}
            minForSearch={minForSearch}
            value={value}
            onChange={(option) => field.onChange(option ?? null)}
            errorText={fieldState.error?.message}
          />
        );
      }}
    />
  );
}
