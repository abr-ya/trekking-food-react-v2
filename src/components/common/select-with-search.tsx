import { useId } from "react";
import AsyncSelect from "react-select/async";
import type { MultiValue, SingleValue } from "react-select";

import { Field, FieldError, FieldLabel } from "@/components/ui/field-cursor";
import { cn } from "@/lib/utils";
import { useSelectStyles } from "./use-select-styles";

/** Option shape for react-select; use as `mapFunc` return type. */
export type SelectWithSearchOption = {
  label: string;
  value: string;
};

type BaseProps<T> = {
  errorText?: string;
  isMulti?: boolean;
  label?: string;
  mapFunc: (el: T) => SelectWithSearchOption;
  minForSearch?: number;
  noOptsEmpty?: string;
  noOptsResult?: string;
  placeholder?: string;
  /** Return raw rows; map with `mapFunc`. Axios: `(q) => api.get(...).then((r) => r.data)`. */
  searchRequest: (query: string) => Promise<T[]>;
  testMode?: boolean;
  width?: number;
  className?: string;
};

type SingleSelectProps<T> = BaseProps<T> & {
  isMulti?: false;
  value?: SingleValue<SelectWithSearchOption>;
  onChange: (value: SingleValue<SelectWithSearchOption>) => void;
};

type MultiSelectProps<T> = BaseProps<T> & {
  isMulti: true;
  value?: MultiValue<SelectWithSearchOption>;
  onChange: (value: MultiValue<SelectWithSearchOption>) => void;
};

export type SelectWithSearchProps<T> = SingleSelectProps<T> | MultiSelectProps<T>;

export { useSelectStyles } from "./use-select-styles";

export function SelectWithSearch<T>({
  minForSearch = 1,
  errorText,
  isMulti = false,
  label,
  noOptsEmpty = `Введите ${minForSearch} или более символов для поиска`,
  noOptsResult = "Не найдены варианты по данному запросу",
  onChange,
  placeholder = "",
  searchRequest,
  testMode,
  value,
  width,
  mapFunc,
  className,
}: SelectWithSearchProps<T>) {
  const inputId = useId();
  const styles = useSelectStyles(Boolean(errorText));

  const loadOptions = (inputValue: string) => {
    if (inputValue.length < minForSearch) {
      return Promise.resolve([] as SelectWithSearchOption[]);
    }

    return searchRequest(inputValue).then((rows) => {
      if (testMode) console.log("search response", rows);
      const options = Array.isArray(rows) ? rows.map(mapFunc) : [];
      if (testMode) console.log("search options", options);
      return options;
    });
  };

  return (
    <Field className={cn(className)} style={width != null ? { width } : undefined}>
      {label ? <FieldLabel htmlFor={inputId}>{label}</FieldLabel> : null}
      <AsyncSelect<SelectWithSearchOption, boolean>
        inputId={label ? inputId : undefined}
        instanceId={inputId}
        isMulti={isMulti}
        placeholder={placeholder}
        cacheOptions
        defaultOptions={false}
        loadOptions={loadOptions}
        noOptionsMessage={({ inputValue }) => (inputValue.length < minForSearch ? noOptsEmpty : noOptsResult)}
        isClearable
        value={value}
        onChange={onChange as (v: MultiValue<SelectWithSearchOption> | SingleValue<SelectWithSearchOption>) => void}
        styles={styles}
        classNamePrefix="select-with-search"
      />
      {errorText ? <FieldError>{errorText}</FieldError> : null}
    </Field>
  );
}
